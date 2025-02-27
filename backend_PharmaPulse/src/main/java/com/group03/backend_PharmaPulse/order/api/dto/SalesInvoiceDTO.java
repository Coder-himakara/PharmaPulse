package com.group03.backend_PharmaPulse.order.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesInvoiceDTO {
    private Long invoiceId;
    private String invoiceNumber;
    private Long orderId;
    private LocalDateTime invoiceDate;
    private List<SalesInvoiceItemDTO> invoiceItems;
    private BigDecimal totalAmount;
    private BigDecimal totalDiscount;
}
