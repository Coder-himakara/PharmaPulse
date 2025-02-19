package com.group03.backend_PharmaPulse.product.internal.mapper;

import com.group03.backend_PharmaPulse.product.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PriceListMapper {
    PriceListMapper INSTANCE = Mappers.getMapper(PriceListMapper.class);

    PriceListDTO toDTO(Product product);

    List<PriceListDTO> toDTOsList(List<Product> products);
}
