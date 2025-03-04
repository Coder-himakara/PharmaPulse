package com.group03.backend_PharmaPulse.order.internal.entity;

import com.group03.backend_PharmaPulse.shared.entity.Invoice;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "sales_invoices")
public class SalesInvoice extends Invoice {

    private Long orderId; // reference to the order
    private Long customerId; // reference to the customer
    private String customerName; // Customer details from Sales module

    @OneToMany(mappedBy = "salesInvoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesInvoiceItem> invoiceItems;
}
