package com.group03.backend_PharmaPulse.inventory.api.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReorderAlertDTO {
    private Long productId;
    private String productName;
    private Integer totalAvailableQuantity;
    private Integer reorderLimitByPackage;
    private List<BatchInventoryDTO> batches;
}