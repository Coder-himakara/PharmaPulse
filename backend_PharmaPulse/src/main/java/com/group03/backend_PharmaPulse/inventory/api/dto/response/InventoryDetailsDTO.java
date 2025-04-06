package com.group03.backend_PharmaPulse.inventory.api.dto.response;

import com.group03.backend_PharmaPulse.inventory.api.enumeration.BatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryDetailsDTO {

    private Long inventoryId;
    private Long locationId;
    //private String locationName;  // Optional: useful for frontend display
    private Long batchId;
    private Integer quantity;
    private Long productId;
    //private String productName;   // Optional: useful for frontend display
    private BigDecimal wholesalePrice;
    private BatchStatus batchStatus;
    private LocalDate expiryDate;
}
