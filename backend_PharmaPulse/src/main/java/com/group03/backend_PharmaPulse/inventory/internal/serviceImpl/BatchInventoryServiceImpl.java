package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;


import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
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
     * Returns a list of BatchInventoryDTOs for batches needing alerts, grouped by threshold.
     */
    @Override
    public List<BatchInventoryDTO> checkExpiryAlerts() {
        LocalDate now = LocalDate.now();
        List<BatchInventoryDTO> alerts = new ArrayList<>();

        // Check 6 months before expiry
        LocalDate sixMonthsBefore = now.plusMonths(6);
        List<BatchInventory> sixMonthBatches = batchInventoryRepo.findByExpiryDateBetween(now, sixMonthsBefore);
        addAlerts(sixMonthBatches, "6 months before expiry", alerts);

        // Check 3 months before expiry
        LocalDate threeMonthsBefore = now.plusMonths(3);
        List<BatchInventory> threeMonthBatches = batchInventoryRepo.findByExpiryDateBetween(now, threeMonthsBefore);
        addAlerts(threeMonthBatches, "3 months before expiry", alerts);

        // Check 1 month before expiry
        LocalDate oneMonthBefore = now.plusMonths(1);
        List<BatchInventory> oneMonthBatches = batchInventoryRepo.findByExpiryDateBetween(now, oneMonthBefore);
        addAlerts(oneMonthBatches, "1 month before expiry", alerts);

        // Check 1 week before expiry
        LocalDate oneWeekBefore = now.plusWeeks(1);
        List<BatchInventory> oneWeekBatches = batchInventoryRepo.findByExpiryDateBetween(now, oneWeekBefore);
        addAlerts(oneWeekBatches, "1 week before expiry", alerts);

        // Filter out expired or sold batches and ensure uniqueness by batchId
        return alerts.stream()
                .filter(dto -> dto.getBatchStatus() != BatchStatus.EXPIRED && dto.getBatchStatus() != BatchStatus.SOLD)
                .distinct()  // Use distinct to remove duplicates based on object equality (batchId will help)
                .toList();
    }

    private void addAlerts(List<BatchInventory> batches, String alertMessage, List<BatchInventoryDTO> alerts) {
        for (BatchInventory batch : batches) {
            if (batch.getBatchStatus() != BatchStatus.EXPIRED && batch.getBatchStatus() != BatchStatus.SOLD) {
                BatchInventoryDTO dto = batchInventoryMapper.toDTO(batch);
                // Check if this batchId already exists in alerts to prevent duplicates
                if (dto.getBatchId() != null && alerts.stream().noneMatch(existing -> existing.getBatchId().equals(dto.getBatchId()))) {
                    System.out.println("Alert for Batch " + batch.getBatchId() + ": " + alertMessage +
                            " - Expiry Date: " + batch.getExpiryDate());
                    alerts.add(dto);
                }
            }
        }
    }

    /**
     * Checks for products needing reorder based on total available quantity across batches compared to reorderLimitByPackage.
     * Returns a list of BatchInventoryDTOs for batches of products requiring reorder alerts.
     */
    @Override
    public List<BatchInventoryDTO> checkReorderAlerts() {
        List<Long> productIds = batchInventoryRepo.findAll().stream()
                .filter(batch -> batch.getBatchStatus() == BatchStatus.AVAILABLE)
                .map(BatchInventory::getProductId)
                .distinct()
                .toList();

        List<BatchInventoryDTO> alerts = new ArrayList<>();
        for (Long productId : productIds) {
            Integer totalAvailable = batchInventoryRepo.sumAvailableUnitQuantityByProductIdAndStatus(productId, BatchStatus.AVAILABLE);
            if (totalAvailable == null) totalAvailable = 0; // Handle case where no batches exist

            ProductDTO product = productService.getProductById(productId);
            if (product != null && totalAvailable <= product.getReorderLimitByPackage()) {
                List<BatchInventory> productBatches = batchInventoryRepo.findByProductIdAndStatus(productId, BatchStatus.AVAILABLE);
                for (BatchInventory batch : productBatches) {
                    BatchInventoryDTO dto = batchInventoryMapper.toDTO(batch);
                    System.out.println("Reorder Alert for Product " + productId + ", Batch " + batch.getBatchId() +
                            ": Total available = " + totalAvailable + ", Reorder limit = " + product.getReorderLimitByPackage());
                    alerts.add(dto);
                }
            }
        }
        return alerts;
    }
}
