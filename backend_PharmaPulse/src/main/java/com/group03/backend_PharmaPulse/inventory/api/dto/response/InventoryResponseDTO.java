package com.group03.backend_PharmaPulse.inventory.api.dto.response;

import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryResponseDTO {
    private Long inventoryId;
    private Long location;
    private Long batch;
    private Integer quantity; //the amount of the batch allocated to this location
}
