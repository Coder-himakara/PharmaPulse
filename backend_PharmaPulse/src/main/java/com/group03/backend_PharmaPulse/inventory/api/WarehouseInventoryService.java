package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import java.util.List;

public interface WarehouseInventoryService {
    List<WarehouseInventoryDTO> getAllWarehouseInventories();
    WarehouseInventoryDTO addOrUpdateWarehouseInventory(WarehouseInventoryDTO warehouseInventoryDTO);
    WarehouseInventoryDTO getWarehouseInventoryByBatchAndLocation(Long batchNumber, Long locationId);
}