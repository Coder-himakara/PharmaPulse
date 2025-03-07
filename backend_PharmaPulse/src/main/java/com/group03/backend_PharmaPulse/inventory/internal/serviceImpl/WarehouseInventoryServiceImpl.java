package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import com.group03.backend_PharmaPulse.inventory.internal.entity.WarehouseInventory;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.WarehouseInventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.BatchInventoryRepo;
import com.group03.backend_PharmaPulse.inventory.internal.repository.InventoryLocationRepo;
import com.group03.backend_PharmaPulse.inventory.internal.repository.WarehouseInventoryRepo;
import com.group03.backend_PharmaPulse.inventory.api.WarehouseInventoryService;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WarehouseInventoryServiceImpl implements WarehouseInventoryService {
    private final WarehouseInventoryMapper warehouseInventoryMapper;
    private final BatchInventoryRepo batchInventoryRepo;
    private final InventoryLocationRepo inventoryLocationRepo;
    private final WarehouseInventoryRepo warehouseInventoryRepo;
    private static final Long MAIN_WAREHOUSE_ID = 1L; // Example: Default main warehouse ID (adjust as needed)

    public WarehouseInventoryServiceImpl(WarehouseInventoryMapper warehouseInventoryMapper,
                                         BatchInventoryRepo batchInventoryRepo,
                                         InventoryLocationRepo inventoryLocationRepo,
                                         WarehouseInventoryRepo warehouseInventoryRepo) {
        this.warehouseInventoryMapper = warehouseInventoryMapper;
        this.batchInventoryRepo = batchInventoryRepo;
        this.inventoryLocationRepo = inventoryLocationRepo;
        this.warehouseInventoryRepo = warehouseInventoryRepo;
    }

    @Override
    public List<WarehouseInventoryDTO> addWarehouseInventoriesFromPurchase(List<WarehouseInventoryDTO> warehouseInventories) {
        InventoryLocation mainWarehouse = inventoryLocationRepo.findById(MAIN_WAREHOUSE_ID)
                .orElseThrow(() -> new NotFoundException("Main warehouse not found with ID: " + MAIN_WAREHOUSE_ID));

        List<WarehouseInventory> warehouseEntities = warehouseInventories.stream()
                .map(dto -> {
                    BatchInventory batch = batchInventoryRepo.findById(dto.getBatch())
                            .orElseThrow(() -> new NotFoundException("Batch not found with ID: " + dto.getBatch()));
                    return WarehouseInventory.builder()
                            .location(mainWarehouse)
                            .batch(batch)
                            .quantity(dto.getQuantity())
                            .warehouseLocation(dto.getWarehouseLocation() != null ? dto.getWarehouseLocation() : "Main Warehouse")
                            .build();
                })
                .collect(Collectors.toList());

        List<WarehouseInventory> savedEntities = warehouseInventoryRepo.saveAll(warehouseEntities); // Save directly using the repository
        return warehouseInventoryMapper.toDTOsList(savedEntities); // Convert saved entities back to DTOs
    }
}