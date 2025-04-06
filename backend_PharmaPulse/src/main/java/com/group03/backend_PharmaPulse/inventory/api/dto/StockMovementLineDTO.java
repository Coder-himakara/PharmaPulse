package com.group03.backend_PharmaPulse.inventory.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementLineDTO {
    //private Long id;
    private Long batch;
    private Integer quantity;
    private String sourceLocation; // Warehouse/Truck ID
    private String targetLocation;

    @JsonIgnore
    private Long stockMovement;// Warehouse/Truck ID
}
