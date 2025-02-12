package com.group03.backend_PharmaPulse.purchase.internal.entity;

import com.group03.backend_PharmaPulse.shared.entity.LineItem;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "purchase_line_item")
public class PurchaseLineItem extends LineItem {

    private LocalDate manufactureDate;
    private LocalDate  expiryDate;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private BigDecimal retailPrice;
    private Long purchaseInvoice;
}
