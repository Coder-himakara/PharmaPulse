package com.group03.backend_PharmaPulse.purchase.entity;

import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.common.enumeration.InvoiceStatus;
import com.group03.backend_PharmaPulse.common.enumeration.PaymentType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@Table(name = "purchase_invoice")
@PrimaryKeyJoinColumn(name = "invoice_id")
public class PurchaseInvoice extends Invoice {

    @Column(nullable = false)
    private int purchaseNo;

    @Column(nullable = false)
    private String supplierId;

    private String purchaseOrderRef;

    @Transient
    private Supplier supplier;

    @OneToMany(mappedBy = "purchaseInvoice",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<PurchaseLineItem> lineItems = new ArrayList<>();

    public PurchaseInvoice(InvoiceStatus invoiceStatus, LocalDateTime invoiceDate, String invoiceNo,
                           PaymentType paymentType, BigDecimal totalAmount,
                           BigDecimal discountAmount, BigDecimal netAmount,
                           int purchaseNo, String supplierId, String purchaseOrderRef) {
        super(invoiceStatus, invoiceDate, invoiceNo, paymentType, totalAmount, discountAmount, netAmount);
        this.purchaseNo = purchaseNo;
        this.supplierId = supplierId;
        this.purchaseOrderRef = purchaseOrderRef;
    }

}
