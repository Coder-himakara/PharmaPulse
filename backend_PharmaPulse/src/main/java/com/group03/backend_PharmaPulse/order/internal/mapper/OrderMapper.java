package com.group03.backend_PharmaPulse.order.internal.mapper;

import com.group03.backend_PharmaPulse.order.api.dto.OrderDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(target = "customer_id", source = "customerId")
    @Mapping(target = "customer_name", source = "customerName")
    @Mapping(target = "orderItems", source = "orderItems")
    OrderDTO toDTO(Order order);

    @Mapping(target = "customerId", source = "customer_id")
    @Mapping(target = "customerName", source = "customer_name")
    @Mapping(target = "orderItems", source = "orderItems")
    Order toEntity(OrderDTO orderDTO);

    List<OrderDTO> toDTOList(List<Order> orders);
}
