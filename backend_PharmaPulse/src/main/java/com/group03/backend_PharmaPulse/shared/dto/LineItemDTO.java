package com.group03.backend_PharmaPulse.shared.dto;

import lombok.Data;

import java.math.BigDecimal;


@Data
public abstract class LineItemDTO {
    //private Long lineItemId;
    private Long productId;
    private Integer quantity;
    private Integer freeQuantity;
    private BigDecimal discountAmount;
}
