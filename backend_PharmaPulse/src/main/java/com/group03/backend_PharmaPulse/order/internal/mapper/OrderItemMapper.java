package com.group03.backend_PharmaPulse.order.internal.mapper;

import com.group03.backend_PharmaPulse.order.api.dto.OrderItemDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.OrderItem;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItemDTO toDTO(OrderItem orderItem);
    OrderItem toEntity(OrderItemDTO orderItemDTO);
    List<OrderItemDTO> toDTOList(List<OrderItem> orderItems);
}
