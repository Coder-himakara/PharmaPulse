package com.group03.backend_PharmaPulse.order.api;

import com.group03.backend_PharmaPulse.order.api.dto.OrderDTO;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(Long orderId);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrder(Long orderId, OrderDTO orderDTO);
}
