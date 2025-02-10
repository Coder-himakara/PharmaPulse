package com.group03.backend_PharmaPulse.shared.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;


@MappedSuperclass
@Data
public abstract class LineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "line_item_id_seq")
    private Long lineItemId;

    private String productId;
    private Integer quantityByPackage;
    private Integer freeQuantity;
    private Integer conversionFactor;  // how many units in a package
    private BigDecimal discountAmount;

}
