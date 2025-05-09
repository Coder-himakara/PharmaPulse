package com.group03.backend_PharmaPulse.inventory.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementDTO {
    private String referenceId; // Link to purchase/sale/transfer ID
    private LocalDateTime timestamp;
    private List<StockMovementLineDTO> lineList;
}
