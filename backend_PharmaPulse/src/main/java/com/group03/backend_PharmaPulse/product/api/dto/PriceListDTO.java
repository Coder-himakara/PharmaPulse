package com.group03.backend_PharmaPulse.product.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PriceListDTO {
    private String productRefId;
    private Long purchaseGroupId;
    // Changed to single productName based on your request, but kept both if you actually need both
    private String productName;
    private String genericName;
    private String unitsPerPack;
    private BigDecimal wholesalePrice;
}