package com.group03.backend_PharmaPulse.inventory.api.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TruckInventoryDTO {
    //private Long inventoryId;
    private Long location;
    private Long batch;
    private Integer quantity;
}
