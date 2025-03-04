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

    private Long productId;
    private Integer quantity;
    private Integer freeQuantity;
    private BigDecimal discountAmount;

}

