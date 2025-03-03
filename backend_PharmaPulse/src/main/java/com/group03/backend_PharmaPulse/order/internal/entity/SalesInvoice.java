package com.group03.backend_PharmaPulse.order.internal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sales_invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sales_invoice_seq")
    @SequenceGenerator(name = "sales_invoice_seq", sequenceName = "sales_invoice_seq", allocationSize = 1)
    private Long invoiceId;

    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    private LocalDateTime invoiceDate;
    private BigDecimal totalAmount;
    private BigDecimal totalDiscount;
    private Long orderId; // reference to the order
    private Long customerId; // reference to the customer
    private String customerName; // Customer details from Sales module
    @OneToMany(mappedBy = "salesInvoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesInvoiceItem> invoiceItems;
}
