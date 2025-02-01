package com.group03.backend_PharmaPulse.inventory.entity;

import com.group03.backend_PharmaPulse.inventory.enumeration.BatchStatus;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseInvoice;
import com.group03.backend_PharmaPulse.purchase.entity.Supplier;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "batch_inventory")
public class BatchInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long batchId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_no")
    private PurchaseInvoice purchaseInvoice;

    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private int purchasedUnitQuantity;
    private int availableUnitQuantity;
    private BigDecimal costPerUnit;
    private BigDecimal retailPrice;
    private BigDecimal discount;

    @Enumerated(EnumType.STRING)
    private BatchStatus batchStatus;

    private LocalDate dateReceived;


}
