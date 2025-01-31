package com.group03.backend_PharmaPulse.common.entity;

import com.group03.backend_PharmaPulse.inventory.entity.Product;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;


@Entity
@Data
@NoArgsConstructor
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "line_item")
public class LineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "line_item_id")
    private Long lineItemId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantityByPackage;
    private Long conversionFactor;  // how many units in a package
    private BigDecimal discountAmount;

    public LineItem(Product product, Integer quantityByPackage, Long conversionFactor, BigDecimal discountAmount) {
        this.product = product;
        this.quantityByPackage = quantityByPackage;
        this.conversionFactor = conversionFactor;
        this.discountAmount = discountAmount;
    }
}
