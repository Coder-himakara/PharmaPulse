package com.group03.backend_PharmaPulse.inventory.dto;

import com.group03.backend_PharmaPulse.inventory.enumeration.*;
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
    private String productId;

    private String productName;
    private String genericName;
    private String description;
    private String productModelNo;

    @Enumerated(EnumType.STRING)
    private ProductCategory category;

    @Enumerated(EnumType.STRING)
    private DosageForm dosageForm;

    @Enumerated(EnumType.STRING)
    private SellingUnit sellingUnit;

    @Enumerated(EnumType.STRING)
    private PackageType packageType;

    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus;

    private Integer reorderLimitBySellingUnit;

    private int purchaseGroupId;
}
