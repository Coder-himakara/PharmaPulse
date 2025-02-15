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

    @Override
    public BatchInventoryDTO addBatchInventory(BatchInventoryDTO batchInventoryDTO) {
        BatchInventory savedBatchInventory = batchInventoryRepo.
                save(batchInventoryMapper.toEntity(batchInventoryDTO));
        return batchInventoryMapper.toDTO(savedBatchInventory);
    }

    @Override
    public List<BatchInventoryDTO> addBatchInventoryList(List<BatchInventoryDTO> batchInventoryList) {
        List<BatchInventory> savedList = batchInventoryRepo.saveAll(batchInventoryMapper
                .toEntityList(batchInventoryList));
        return batchInventoryMapper.toDTOsList(savedList);
    }

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
}
