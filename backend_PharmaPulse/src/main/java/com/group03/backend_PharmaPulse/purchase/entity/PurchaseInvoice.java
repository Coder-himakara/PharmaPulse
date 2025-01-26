package com.group03.backend_PharmaPulse.purchase.entity;

import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.common.enumeration.InvoiceStatus;
import com.group03.backend_PharmaPulse.common.enumeration.PaymentType;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@Table(name = "purchase_invoice")
@PrimaryKeyJoinColumn(name = "invoice_id")
public class PurchaseInvoice extends Invoice {
    private int purchaseNo;
    private String supplierId;
    private String purchaseOrderRef;

}
