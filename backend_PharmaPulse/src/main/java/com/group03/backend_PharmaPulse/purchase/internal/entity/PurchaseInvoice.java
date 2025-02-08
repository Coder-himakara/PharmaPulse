package com.group03.backend_PharmaPulse.purchase.internal.entity;

import com.group03.backend_PharmaPulse.shared.InvoiceReference;
import com.group03.backend_PharmaPulse.shared.entity.Invoice;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;



import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "purchase_invoice")
public class PurchaseInvoice extends Invoice implements InvoiceReference {

    @Column(nullable = false)
    private Long purchaseNo;

    @Column(nullable = false)
    private Long supplierId;

    private String purchaseOrderRef;

    @Transient
    private Supplier supplier;

    @OneToMany(mappedBy = "purchaseInvoice",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<PurchaseLineItem> lineItems = new ArrayList<>();

}
