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

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    //new
    /**
     * Deduct sold quantity from available inventory.
     * Processes batches sorted by expiry date (FIFO).
     */
    @Override
    public void deductInventory(Long productId, Integer quantity) {
        List<BatchInventory> batches = batchInventoryRepo.findByProductId(productId)
                .stream()
                .filter(b -> b.getAvailableUnitQuantity() != null && b.getAvailableUnitQuantity() > 0)
                .sorted(Comparator.comparing(BatchInventory::getExpiryDate))
                .collect(Collectors.toList());

        int remaining = quantity;
        for (BatchInventory batch : batches) {
            if (remaining <= 0) break;
            int available = batch.getAvailableUnitQuantity();
            if (available >= remaining) {
                batch.setAvailableUnitQuantity(available - remaining);
                remaining = 0;
            } else {
                batch.setAvailableUnitQuantity(0);
                remaining -= available;
            }
            batchInventoryRepo.save(batch);
        }
        if (remaining > 0) {
            throw new RuntimeException("Not enough inventory to deduct " + quantity + " units for product id " + productId);
        }
    }

    /**
     * Reserve inventory temporarily by reducing available quantity and increasing reserved quantity.
     */
    @Override
    public void reserveInventory(Long productId, Integer quantity) {
        List<BatchInventory> batches = batchInventoryRepo.findByProductId(productId)
                .stream()
                .filter(b -> b.getAvailableUnitQuantity() != null && b.getAvailableUnitQuantity() > 0)
                .sorted(Comparator.comparing(BatchInventory::getExpiryDate))
                .collect(Collectors.toList());

        int remaining = quantity;
        for (BatchInventory batch : batches) {
            if (remaining <= 0) break;
            int available = batch.getAvailableUnitQuantity();
            int reserveFromThisBatch = Math.min(available, remaining);
            batch.setAvailableUnitQuantity(available - reserveFromThisBatch);
            int currentReserved = batch.getReservedQuantity() == null ? 0 : batch.getReservedQuantity();
            batch.setReservedQuantity(currentReserved + reserveFromThisBatch);
            remaining -= reserveFromThisBatch;
            batchInventoryRepo.save(batch);
        }
        if (remaining > 0) {
            throw new RuntimeException("Not enough inventory to reserve " + quantity + " units for product id " + productId);
        }
    }

}