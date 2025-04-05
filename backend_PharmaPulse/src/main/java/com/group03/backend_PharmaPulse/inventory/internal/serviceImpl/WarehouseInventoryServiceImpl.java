package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.WarehouseInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.WarehouseInventory;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.WarehouseInventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.WarehouseInventoryRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseInventoryServiceImpl implements WarehouseInventoryService {
    private final WarehouseInventoryRepo warehouseInventoryRepo;
    private final WarehouseInventoryMapper warehouseInventoryMapper;

    public WarehouseInventoryServiceImpl(WarehouseInventoryRepo warehouseInventoryRepo,
                                         WarehouseInventoryMapper warehouseInventoryMapper) {
        this.warehouseInventoryRepo = warehouseInventoryRepo;
        this.warehouseInventoryMapper = warehouseInventoryMapper;
    }

    @Override
    public List<WarehouseInventoryDTO> getAllWarehouseInventories() {
        List<WarehouseInventoryDTO> warehouseInventories = warehouseInventoryRepo.findAllWarehouseInventoryDetails();
        if (!warehouseInventories.isEmpty()) {
            return warehouseInventories;
        } else {
            throw new NotFoundException("No Warehouse Inventories found");
        }
    }

    @Override
    public WarehouseInventoryDTO addOrUpdateWarehouseInventory(WarehouseInventoryDTO warehouseInventoryDTO) {
        try {
            // Check if inventory already exists
            WarehouseInventory existingInventory = null;
            try {
                existingInventory = warehouseInventoryRepo
                        .findByBatchIdAndLocationId(
                                warehouseInventoryDTO.getBatch(),
                                warehouseInventoryDTO.getLocation()
                        ).orElse(null);
            } catch (Exception e) {
                // If exception occurs during lookup, continue with creation
            }

            if (existingInventory != null) {
                // Update existing inventory by adding the new quantity to the existing one
                int updatedQuantity = existingInventory.getQuantity() + warehouseInventoryDTO.getQuantity();
                existingInventory.setQuantity(updatedQuantity);

                // If the DTO has warehouse location information, update it
                if (warehouseInventoryDTO.getWarehouseLocation() != null) {
                    existingInventory.setWarehouseLocation(warehouseInventoryDTO.getWarehouseLocation());
                }
                WarehouseInventory savedInventory = warehouseInventoryRepo.save(existingInventory);
                return warehouseInventoryMapper.toDTO(savedInventory);
            } else {
                // Create new inventory
                WarehouseInventory newInventory = warehouseInventoryMapper.toEntity(warehouseInventoryDTO);
                WarehouseInventory savedInventory = warehouseInventoryRepo.save(newInventory);
                return warehouseInventoryMapper.toDTO(savedInventory);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to add or update warehouse inventory", e);
        }
    }

    @Override
    public WarehouseInventoryDTO getWarehouseInventoryByBatchAndLocation(Long batchNumber, Long locationId) {
        try {
            return warehouseInventoryRepo.findByBatchIdAndLocationId(batchNumber, locationId)
                    .map(warehouseInventoryMapper::toDTO)
                    .orElseThrow(() -> new NotFoundException(
                            "Warehouse inventory not found for batch " + batchNumber + " at location " + locationId));
        } catch (Exception e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new RuntimeException("Error retrieving warehouse inventory", e);
        }
    }
}
