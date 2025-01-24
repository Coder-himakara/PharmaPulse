package com.group03.backend_PharmaPulse.purchase.entity;

import com.group03.backend_PharmaPulse.common.entity.Invoice;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "purchase_invoice")
@PrimaryKeyJoinColumn(name = "invoice_id")
public class PurchaseInvoice extends Invoice {
    private int purchaseNo;
    private String supplierId;
    private String purchaseOrderRef;

}
