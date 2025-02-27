package com.group03.backend_PharmaPulse.order.internal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_list")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceList {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "price_list_seq")
    @SequenceGenerator(name = "price_list_seq", sequenceName = "price_list_seq", allocationSize = 1)
    private Long id;

    private Long productId;
    private String productRefId;
    private Long purchaseGroupId;
    private String productName;
    private String genericName;
    private String unitsPerPack;
    private BigDecimal wholesalePrice;
    private LocalDateTime updatedAt;
}
