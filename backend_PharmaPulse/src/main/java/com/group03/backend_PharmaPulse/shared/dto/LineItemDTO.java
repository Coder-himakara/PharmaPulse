package com.group03.backend_PharmaPulse.shared.dto;

import lombok.Data;

import java.math.BigDecimal;


@Data
public abstract class LineItemDTO {
    //private Long lineItemId;
    private Long productId;
    private Integer quantityByPackage;
    private Integer freeQuantity; //for free items no price is calculated
    private Integer conversionFactor;  // how many units in a package
    private BigDecimal discountAmount;
}
