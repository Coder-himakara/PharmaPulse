package com.group03.backend_PharmaPulse.inventory.dto;

import com.group03.backend_PharmaPulse.inventory.enumeration.BatchStatus;
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
    private String product;
    private Long invoice;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private int purchasedUnitQuantity;
    private int availableUnitQuantity;
    private BigDecimal costPerUnit;
    private BigDecimal retailPrice;
    private BigDecimal discount;

    @Enumerated(EnumType.STRING)
    private BatchStatus batchStatus;

    private LocalDate dateReceived;
}
