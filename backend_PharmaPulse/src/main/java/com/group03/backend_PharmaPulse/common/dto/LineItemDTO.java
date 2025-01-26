package com.group03.backend_PharmaPulse.common.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.sql.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LineItemDTO {
    //private Long lineItemId;
    //private Invoice invoice;
    private int product;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private BigDecimal discountAmount;
    private Date manufactureDate;
    private Date expiryDate;
}
