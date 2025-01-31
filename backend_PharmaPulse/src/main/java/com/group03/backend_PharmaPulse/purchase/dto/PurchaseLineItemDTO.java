package com.group03.backend_PharmaPulse.purchase.dto;

import com.group03.backend_PharmaPulse.common.dto.LineItemDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class PurchaseLineItemDTO extends LineItemDTO {
    private BigDecimal costPerUnit;
    private BigDecimal totalCost;
    private LocalDate manufactureDate;
    private LocalDate  expiryDate;
    private BigDecimal unitPrice; //check and rename.Retail price of the product
    private Long purchaseInvoice;
}
