package com.group03.backend_PharmaPulse.product.internal.entity;

import com.group03.backend_PharmaPulse.product.api.enumeration.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "product")
public class Product {
    @Id
    @Column(name = "product_id",length = 50)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_id_seq")
    private Long productId;

    private Long purchaseGroupId;

    @Column(name = "product_ref_id", unique = true, nullable = false)
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

    //LAZY fetch type is used to avoid fetching all the product retail prices when a product is fetched
    //@OneToMany(mappedBy="product" ,fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    //private Set<ProductWholesalePrice> productRetailPrices;
}
