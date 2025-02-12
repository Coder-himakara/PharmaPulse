package com.group03.backend_PharmaPulse.inventory.api.dto;

import com.group03.backend_PharmaPulse.inventory.api.enumeration.BatchStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class BatchInventoryDTO {
    //private Long batchId;
    private Long productId;
    private Long purchaseInvoiceNo;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private Integer purchasedUnitQuantity;
    private Integer availableUnitQuantity;
    private BigDecimal costPerUnit;
    private BigDecimal retailPrice;
    private BigDecimal discount;

    @Enumerated(EnumType.STRING)
    private BatchStatus batchStatus;

    private LocalDate dateReceived;
}
