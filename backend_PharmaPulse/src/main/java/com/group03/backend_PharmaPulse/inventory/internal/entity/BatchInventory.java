package com.group03.backend_PharmaPulse.inventory.internal.entity;

import com.group03.backend_PharmaPulse.shared.InvoiceReference;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.BatchStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "batch_inventory")
public class BatchInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "batch_id_seq")
    @Column(name = "batch_id",length = 50)
    private Long batchId;

    private Long productId;

    private Long purchaseInvoiceNo;

    @Transient
    private InvoiceReference purchaseInvoice;

    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private Integer purchasedUnitQuantity;
    private Integer freeQuantity;
    private Integer availableUnitQuantity;
    private BigDecimal wholesalePrice;
    private BigDecimal retailPrice;
    private BigDecimal discount;

    @Enumerated(EnumType.STRING)
    private BatchStatus batchStatus;

    private LocalDate dateReceived;

    // New field for temporary reservation
    //private Integer reservedQuantity;

    @OneToMany(mappedBy ="batch",fetch =FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Inventory> inventoryRecords;

    @OneToMany(mappedBy = "batch", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<StockMovementLine> stockMovementLines;
}
