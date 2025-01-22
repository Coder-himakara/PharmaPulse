package com.group03.backend_PharmaPulse.inventory.mapper;

import com.group03.backend_PharmaPulse.inventory.dto.ProductDTO;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDTO toDTO(Product product);
    Product toEntity(ProductDTO productDTO);
    List<ProductDTO> toDTOsList(List<Product> products);
}
