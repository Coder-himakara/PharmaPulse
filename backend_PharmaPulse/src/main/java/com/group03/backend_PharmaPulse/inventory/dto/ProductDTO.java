package com.group03.backend_PharmaPulse.inventory.dto;

import com.group03.backend_PharmaPulse.inventory.enumeration.DosageForm;
import com.group03.backend_PharmaPulse.inventory.enumeration.PackageType;
import com.group03.backend_PharmaPulse.inventory.enumeration.ProductCategory;
import com.group03.backend_PharmaPulse.inventory.enumeration.ProductStatus;
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
    private String product_id;

    private String product_name;
    private String generic_name;
    private String description;
    private String product_ModelNo;

    @Enumerated(EnumType.STRING)
    private ProductCategory category;

    @Enumerated(EnumType.STRING)
    private DosageForm dosage_form;

    private String strength;

    @Enumerated(EnumType.STRING)
    private PackageType package_type;

    @Enumerated(EnumType.STRING)
    private ProductStatus product_status;

    private Integer reorder_limit;

    private int purchaseGroupId;
}
