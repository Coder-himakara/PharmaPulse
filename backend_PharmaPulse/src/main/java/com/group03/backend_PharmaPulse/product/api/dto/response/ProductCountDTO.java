package com.group03.backend_PharmaPulse.product.api.dto.response;

import com.group03.backend_PharmaPulse.product.api.enumeration.ProductStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductCountDTO {
    private Long productId;
    private Long purchaseGroupId;
    private String productRefId;
    private String productName;

    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus;

    private Integer reorderLimitByPackage;
}
