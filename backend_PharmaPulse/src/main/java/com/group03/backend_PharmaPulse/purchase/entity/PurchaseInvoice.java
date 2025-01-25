package com.group03.backend_PharmaPulse.purchase.entity;

import com.group03.backend_PharmaPulse.common.entity.Invoice;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Entity
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table(name = "purchase_invoice")
@PrimaryKeyJoinColumn(name = "invoice_id")
public class PurchaseInvoice extends Invoice {
    private int purchaseNo;
    private String supplierId;
    private String purchaseOrderRef;

}
