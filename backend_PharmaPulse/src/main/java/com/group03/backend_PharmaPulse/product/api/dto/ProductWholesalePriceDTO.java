package com.group03.backend_PharmaPulse.product.api.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductWholesalePriceDTO {
    //private Long priceId;
    private Long product;
    private String createdBy;
    private LocalDateTime effectiveDate;
    private LocalDateTime endDate;
    private BigDecimal retailPrice;
}
