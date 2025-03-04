package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ExpiryAlertDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ReorderAlertDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.BatchStatus;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.BatchInventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.BatchInventoryRepo;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.api.event.PurchaseLineItemEvent;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;
import java.util.*;
import java.util.Optional;

@Service
public class BatchInventoryServiceImpl implements BatchInventoryService {
    private final BatchInventoryRepo batchInventoryRepo;
    private final BatchInventoryMapper batchInventoryMapper;
    private final ProductService productService;

    public BatchInventoryServiceImpl(BatchInventoryRepo batchInventoryRepo,
                                     BatchInventoryMapper batchInventoryMapper,
                                     ProductService productService){
        this.batchInventoryRepo=batchInventoryRepo;
        this.batchInventoryMapper=batchInventoryMapper;
        this.productService=productService;
    }

    @Override
    public List<BatchInventoryDTO> getAllBatchInventories() {
        List<BatchInventory> batchInventories = batchInventoryRepo.findAll();
        if(!batchInventories.isEmpty()){
            return batchInventoryMapper.toDTOsList(batchInventories);
        }else{
            throw new NotFoundException("No Batch Inventories found");
        }
    }

    @Override
    public BatchInventoryDTO getBatchInventoryById(Long id) {
        Optional<BatchInventory> batchInventory = batchInventoryRepo.findById(id);
        return batchInventory.map(batchInventoryMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Batch Inventory not found"));
    }
    /**
     * Event listener for PurchaseLineItemEvent.
     * BatchInventory record is created for each PurchaseLineItem.
     * @return List<BatchInventory>
     */
    @EventListener
    public List<BatchInventory> batchInventoryListener(PurchaseLineItemEvent purchaseLineItemEvent) {
        List<BatchInventory> batches=purchaseLineItemEvent.getPurchaseLineItemDTOS()
                .stream()
                .map(this::convertToBatchInventory)
                .toList();
        return batchInventoryRepo.saveAll(batches);
    }
    private BatchInventory convertToBatchInventory(PurchaseLineItemDTO dto) {
        Integer totalQuantity = dto.getQuantity() + dto.getFreeQuantity();
        //check if product exists
        ProductDTO productDTO= productService.getProductById(dto.getProductId());
        if(productDTO==null){
            throw new EntityNotFoundException("Product not found");

        }else{
            return BatchInventory.builder()
                    .productId(dto.getProductId())
                    .purchaseInvoiceNo(dto.getPurchaseInvoice())
                    .manufactureDate(dto.getManufactureDate())
                    .expiryDate(dto.getExpiryDate())
                    .purchasedUnitQuantity(dto.getQuantity())
                    .freeQuantity(dto.getFreeQuantity())
                    .availableUnitQuantity(totalQuantity) // Initially same as purchased
                    .wholesalePrice(dto.getUnitPrice())
                    .retailPrice(dto.getRetailPrice())
                    .discount(dto.getDiscountAmount())
                    .batchStatus(BatchStatus.AVAILABLE)
                    .dateReceived(LocalDate.now())
                    .build();
        }
    }

    /**
     * Checks for batches nearing expiry and generates alerts for 6 months, 3 months, 1 month, and 1 week before expiry.
     * Returns a list of ExpiryAlertDTOs for batches needing alerts, grouped by product and sorted by earliest expiry date.
     *
     * @return List of ExpiryAlertDTOs containing product-based expiry alerts
     * @throws NotFoundException if a product associated with a batch is not found
     */
    @Override
    public List<ExpiryAlertDTO> checkExpiryAlerts() {
        LocalDate now = LocalDate.now();
        Map<Long, ExpiryAlertDTO> alertsByProduct = new HashMap<>();

        // Define timeframes for alerts
        Map<String, LocalDate> thresholds = new HashMap<>();
        thresholds.put("6 months before expiry", now.plusMonths(6));
        thresholds.put("3 months before expiry", now.plusMonths(3));
        thresholds.put("1 month before expiry", now.plusMonths(1));
        thresholds.put("1 week before expiry", now.plusWeeks(1));

        // Check each threshold
        for (Map.Entry<String, LocalDate> threshold : thresholds.entrySet()) {
            String alertMessage = threshold.getKey();
            LocalDate endDate = threshold.getValue();
            List<BatchInventory> batches = batchInventoryRepo.findByExpiryDateBetween(now, endDate);

            for (BatchInventory batch : batches) {
                if (batch.getBatchStatus() != BatchStatus.EXPIRED && batch.getBatchStatus() != BatchStatus.SOLD) {
                    Long productId = batch.getProductId();
                    ProductDTO product = productService.getProductById(productId);
                    if (product == null) {
                        throw new NotFoundException("Product not found for ID: " + productId);
                    }

                    ExpiryAlertDTO alert = alertsByProduct.get(productId);
                    if (alert == null) {
                        alert = ExpiryAlertDTO.builder()
                                .productId(productId)
                                .productName(product.getProductName())
                                .batches(new ArrayList<>())
                                .alertMessage(alertMessage)
                                .earliestExpiryDate(batch.getExpiryDate())
                                .build();
                        alertsByProduct.put(productId, alert);
                    }

                    // Add batch if not already included (ensure uniqueness by batchId)
                    BatchInventoryDTO batchDto = batchInventoryMapper.toDTO(batch);
                    if (alert.getBatches().stream().noneMatch(b -> b.getBatchId().equals(batchDto.getBatchId()))) {
                        alert.getBatches().add(batchDto);
                        // Update earlier expiry date if this batch expires earlier
                        if (batch.getExpiryDate().isBefore(alert.getEarliestExpiryDate())) {
                            alert.setEarliestExpiryDate(batch.getExpiryDate());
                        }
                    }
                }
            }
        }

        // Convert map values to list and sort by earliest expiry date
        List<ExpiryAlertDTO> finalAlerts = new ArrayList<>(alertsByProduct.values());
        finalAlerts.sort(Comparator.comparing(ExpiryAlertDTO::getEarliestExpiryDate));

        return finalAlerts;
    }

    /**
     * Checks for products needing reorder based on total available quantity across batches compared to reorderLimitByPackage.
     * Returns a list of ReorderAlertDTOs for products requiring reorder alerts, grouped by product.
     *
     * @return List of ReorderAlertDTOs containing product-based reorder alerts
     * @throws NotFoundException if a product associated with a batch is not found
     */
    @Override
    public List<ReorderAlertDTO> checkReorderAlerts() {
        // Get distinct product IDs for AVAILABLE batches
        List<Long> productIds = batchInventoryRepo.findAll().stream()
                .filter(batch -> batch.getBatchStatus() == BatchStatus.AVAILABLE)
                .map(BatchInventory::getProductId)
                .distinct()
                .toList();

        List<ReorderAlertDTO> alerts = new ArrayList<>();
        for (Long productId : productIds) {
            Integer totalAvailable = batchInventoryRepo.sumAvailableUnitQuantityByProductIdAndStatus(productId, BatchStatus.AVAILABLE);
            if (totalAvailable == null) totalAvailable = 0; // Handle case where no batches exist

            ProductDTO product = productService.getProductById(productId);
            if (product != null && totalAvailable <= product.getReorderLimitByPackage()) {
                // Get all AVAILABLE batches for this product
                List<BatchInventory> productBatches = batchInventoryRepo.findByProductIdAndStatus(productId, BatchStatus.AVAILABLE);
                List<BatchInventoryDTO> batchDtos = productBatches.stream()
                        .map(batchInventoryMapper::toDTO)
                        .toList();

                ReorderAlertDTO alert = ReorderAlertDTO.builder()
                        .productId(productId)
                        .productName(product.getProductName())
                        .totalAvailableQuantity(totalAvailable)
                        .reorderLimitByPackage(product.getReorderLimitByPackage())
                        .batches(batchDtos)
                        .build();

                alerts.add(alert);
                System.out.println("Reorder Alert for Product " + productId + ": Total available = " + totalAvailable +
                        ", Reorder limit = " + product.getReorderLimitByPackage());
            }
        }

        // Sort alerts by totalAvailableQuantity (low to high) for prioritization
        alerts.sort(Comparator.comparing(ReorderAlertDTO::getTotalAvailableQuantity));

        return alerts;
    }
}
