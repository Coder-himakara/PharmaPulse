package com.group03.backend_PharmaPulse.order.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PriceListDTO {
    private Long productId;
    private String productRefId;
    private Long purchaseGroupId;
    private String purchaseGroupName;
    private String productName;
    private String genericName;
    private String unitsPerPack;
    private BigDecimal wholesalePrice;
    private LocalDate expiryDate;
}
