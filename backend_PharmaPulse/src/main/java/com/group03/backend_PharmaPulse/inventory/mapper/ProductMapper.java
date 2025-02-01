package com.group03.backend_PharmaPulse.inventory.mapper;

import com.group03.backend_PharmaPulse.inventory.dto.ProductDTO;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDTO toDTO(Product product);

    @Mapping(target = "purchaseGroup",ignore = true)
    @Mapping(target = "productRetailPrices",ignore = true)
    @Mapping(target = "batchInventories",ignore = true)
    Product toEntity(ProductDTO productDTO);

    List<ProductDTO> toDTOsList(List<Product> products);
}
