package com.group03.backend_PharmaPulse.order.api.dto;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
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
    private CustomerDTO customer;  // Customer details from Sales module
    private List<OrderItemDTO> orderItems;
    private BigDecimal totalAmount;
    private BigDecimal totalDiscount;
    private LocalDateTime orderDate;
    private String status; // e.g., "PENDING", "SUBMITTED", "INVOICED"
}
