package com.group03.backend_PharmaPulse.common.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@SuperBuilder
public class LineItemDTO {
    //private Long lineItemId;
    private String product;
    private Integer quantityByPackage;
    private Long conversionFactor;  // how many units in a package
    private BigDecimal discountAmount;
}
