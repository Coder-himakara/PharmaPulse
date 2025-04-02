package com.group03.backend_PharmaPulse.order.internal.mapper;

import com.group03.backend_PharmaPulse.order.api.dto.OrderDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(target = "orderId", source = "orderId")//new
    @Mapping(target = "orderItems", source = "orderItems")
    OrderDTO toDTO(Order order);

    @Mapping(target = "orderItems", source = "orderItems")
    @Mapping(target = "orderId", ignore = true)
    Order toEntity(OrderDTO orderDTO);

    List<OrderDTO> toDTOList(List<Order> orders);
}
