package com.group03.backend_PharmaPulse.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRetailPriceDTO {
    //private Long price_id;
    private String product;
    private BigDecimal retail_price;
    private Date effective_date;
    private Date end_date;
    private String created_by; // what purchase order has made this price
}
