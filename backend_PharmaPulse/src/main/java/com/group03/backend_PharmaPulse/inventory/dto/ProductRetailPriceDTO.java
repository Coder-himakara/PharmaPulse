package com.group03.backend_PharmaPulse.inventory.dto;

import com.group03.backend_PharmaPulse.inventory.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRetailPriceDTO {
    //private Long priceId;
    private String product;
    private String createdBy;
    private LocalDateTime effectiveDate;
    private LocalDateTime endDate;
    private BigDecimal retailPrice;
}
