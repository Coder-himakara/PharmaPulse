package com.group03.backend_PharmaPulse.inventory.api.dto.response;

import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WarehouseInventoryResponse {
    private Long inventoryId;

    private InventoryLocation locationId;

    private List<BatchInventory> batchInventory;

    private Integer quantity;
    private Integer totalQuantity;
    private String warehouseLocation;
}
