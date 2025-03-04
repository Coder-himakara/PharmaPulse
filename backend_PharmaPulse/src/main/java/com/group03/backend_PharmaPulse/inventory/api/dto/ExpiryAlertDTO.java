package com.group03.backend_PharmaPulse.inventory.api.dto;

import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpiryAlertDTO {
    private Long productId;
    private String productName;
    private List<BatchInventoryDTO> batches;
    private String alertMessage; // e.g., "6 months before expiry"
    private LocalDate earliestExpiryDate; // Earliest expiry date among batches
}