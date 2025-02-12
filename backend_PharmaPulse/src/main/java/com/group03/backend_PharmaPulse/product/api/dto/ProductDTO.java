package com.group03.backend_PharmaPulse.product.api.dto;

import com.group03.backend_PharmaPulse.product.api.enumeration.*;
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
public class ProductDTO {
    //private Long productId;

    private Long purchaseGroupId;
    private String productRefId;

    private String productName;

    private String genericName;
    private String description;

    @Enumerated(EnumType.STRING)
    private ProductCategory category;

    @Enumerated(EnumType.STRING)
    private PackageType packageType;

    private String unitsPerPack;

    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus;

    private Integer reorderLimitByPackage;
}
