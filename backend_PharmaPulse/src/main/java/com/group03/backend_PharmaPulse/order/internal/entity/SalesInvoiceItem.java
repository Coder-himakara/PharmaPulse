package com.group03.backend_PharmaPulse.order.internal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "sales_invoice_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesInvoiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sales_invoice_item_seq")
    @SequenceGenerator(name = "sales_invoice_item_seq", sequenceName = "sales_invoice_item_seq", allocationSize = 1)
    private Long invoiceItemId;

    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal discount;
    private BigDecimal lineTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_invoice_id")
    private SalesInvoice salesInvoice;
}
