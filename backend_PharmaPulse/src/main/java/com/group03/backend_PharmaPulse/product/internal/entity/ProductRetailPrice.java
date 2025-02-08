package com.group03.backend_PharmaPulse.product.internal.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "product_retailPrice")
public class ProductRetailPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "retail_price_id_seq")
    private Long priceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "effective_date", nullable = false)
    private LocalDateTime effectiveDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "retail_price", nullable = false)
    private BigDecimal retailPrice;
}
