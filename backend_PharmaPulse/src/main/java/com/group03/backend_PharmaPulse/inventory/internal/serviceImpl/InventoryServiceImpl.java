package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.InventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryDetailsDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryResponseDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Inventory;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.BatchInventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.InventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.InventoryRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {
    private final InventoryRepo inventoryRepo;
    private final InventoryMapper inventoryMapper;
    private final BatchInventoryService batchInventoryService;
    private final BatchInventoryMapper batchInventoryMapper;

    public InventoryServiceImpl(InventoryRepo inventoryRepo,InventoryMapper inventoryMapper,
                                BatchInventoryMapper batchInventoryMapper,
                                BatchInventoryService batchInventoryService) {
        this.inventoryRepo = inventoryRepo;
        this.inventoryMapper = inventoryMapper;
        this.batchInventoryMapper = batchInventoryMapper;
        this.batchInventoryService = batchInventoryService;
    }
    @Override
    public List<InventoryResponseDTO> getAllInventories() {
        List<Inventory> inventories = inventoryRepo.findAll();
        if(!inventories.isEmpty()){
            return inventoryMapper.toResponseDTOList(inventories);
        }else{
            throw new NotFoundException("No inventories found");
        }
    }
    @Override
    public List<InventoryDetailsDTO> getInventoryDetails() {
        // Get inventory data
        List<InventoryResponseDTO> inventories = getAllInventories();
        List<InventoryDetailsDTO> detailsList = new ArrayList<>();

        // For each inventory record, combine with batch details
        for (InventoryResponseDTO inventory : inventories) {
            // Get batch details using the batch ID from inventory
            BatchInventory batchInventory = batchInventoryMapper.toEntity(
                    batchInventoryService.getBatchInventoryById(inventory.getBatch()));

            // Create and populate the combined DTO
            InventoryDetailsDTO detailsDTO = InventoryDetailsDTO.builder()
                    .inventoryId(inventory.getInventoryId())
                    .locationId(inventory.getLocation())
                    .batchId(inventory.getBatch())
                    .quantity(inventory.getQuantity())
                    // Data from BatchInventory
                    .productId(batchInventory.getProductId())
                    .wholesalePrice(batchInventory.getWholesalePrice())
                    .batchStatus(batchInventory.getBatchStatus())
                    .expiryDate(batchInventory.getExpiryDate())
                    .build();

            detailsList.add(detailsDTO);
        }
        return detailsList;
    }
}
