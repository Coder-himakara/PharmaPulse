package com.group03.backend_PharmaPulse.purchase.api.dto;

import com.group03.backend_PharmaPulse.shared.dto.LineItemDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PurchaseLineItemDTO extends LineItemDTO {
    private LocalDate manufactureDate;
    private LocalDate  expiryDate;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private BigDecimal retailPrice;
    private Long purchaseInvoice;
}
