package com.group03.backend_PharmaPulse.product.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PriceListDTO {
    private String productName;
    private Integer purchaseGroupId;
}
