package com.group03.backend_PharmaPulse.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "product_retailPrice")
public class ProductRetailPrice {
    @Id
    @Column(name = "price_id")
    private Long price_id;

    @ManyToOne
    @JoinColumn(name="product_id", nullable=false)
    private Product product;

    private BigDecimal retail_price;
    private Date effective_date;
    private Date end_date;
    private String created_by; // what purchase order has made this price

}
