package com.group03.backend_PharmaPulse.inventory.entity;


import com.group03.backend_PharmaPulse.common.PurchaseGroupInterface;
import com.group03.backend_PharmaPulse.inventory.enumeration.DosageForm;
import com.group03.backend_PharmaPulse.inventory.enumeration.PackageType;
import com.group03.backend_PharmaPulse.inventory.enumeration.ProductCategory;
import com.group03.backend_PharmaPulse.inventory.enumeration.ProductStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "product")
public class Product {
    @Id
    @Column(name = "product_id",length = 50)
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

    @Column(name = "purchase_group_id", nullable = false)
    private int purchaseGroupId;

    @Transient
    private PurchaseGroupInterface purchase_group;

    //LAZY fetch type is used to avoid fetching all the product retail prices when a product is fetched
    @OneToMany(mappedBy="product" ,fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductRetailPrice> productRetailPrices;

}
