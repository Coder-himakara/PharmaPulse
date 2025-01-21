package com.group03.backend_PharmaPulse.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
