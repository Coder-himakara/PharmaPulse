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
public class OrderDTO {
    private Long orderId;
    private String orderNumber;

    private Long customerId;
    private String customerName;

    private BigDecimal totalAmount;
    private BigDecimal totalDiscount;
    private LocalDateTime orderDate;
    private String status; // e.g., "PENDING", "SUBMITTED", "INVOICED"

    private List<OrderItemDTO> orderItems;
}
