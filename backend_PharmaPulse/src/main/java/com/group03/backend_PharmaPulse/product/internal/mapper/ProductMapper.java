package com.group03.backend_PharmaPulse.product.internal.mapper;

import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "productId",ignore = true)
    @Mapping(target = "productWholesalePrices",ignore = true)
    Product toEntity(ProductDTO productDTO);

    ProductDTO toDTO(Product product);

    List<ProductDTO> toDTOsList(List<Product> products);
}
