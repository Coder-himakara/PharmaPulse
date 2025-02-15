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
    private ProductCategory category; //medicine or surgical

    @Enumerated(EnumType.STRING)
    private PackageType packageType; //package type of the selling unit

    private String unitsPerPack; //ex: 10 tablets per pack 10x1 or 10T

    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus;

    private Integer reorderLimitByPackage;
}
