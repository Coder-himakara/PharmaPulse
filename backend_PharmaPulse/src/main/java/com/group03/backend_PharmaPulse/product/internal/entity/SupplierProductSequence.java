package com.group03.backend_PharmaPulse.product.internal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "supplier_product_sequence")
public class SupplierProductSequence {
    @Id
    @Column(name = "supplier_id")
    private String supplierId;

    @Column(name = "current_sequence")
    private Integer currentSequence;
}
