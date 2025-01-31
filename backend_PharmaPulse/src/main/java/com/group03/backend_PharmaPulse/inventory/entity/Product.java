package com.group03.backend_PharmaPulse.inventory.entity;


import com.group03.backend_PharmaPulse.common.PurchaseGroupInterface;
import com.group03.backend_PharmaPulse.inventory.enumeration.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "product")
public class Product {
    @Id
    @Column(name = "product_id",length = 50)
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

    @Column(name = "purchase_group_id", nullable = false)
    private int purchaseGroupId;

    @Transient
    private PurchaseGroupInterface purchaseGroup;

    //LAZY fetch type is used to avoid fetching all the product retail prices when a product is fetched
    @OneToMany(mappedBy="product" ,fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductRetailPrice> productRetailPrices;

}
