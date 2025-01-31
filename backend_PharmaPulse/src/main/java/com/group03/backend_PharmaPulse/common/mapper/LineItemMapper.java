package com.group03.backend_PharmaPulse.common.mapper;

import com.group03.backend_PharmaPulse.common.dto.LineItemDTO;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;


import java.util.List;

@Mapper(componentModel = "spring")
public interface LineItemMapper {

    // Map DTO to Entity (single object)
    @Named("toEntity")
    @Mapping(target = "lineItemId", ignore = true)
    @Mapping(target = "product", source = "product", qualifiedByName = "mapProductId")
    LineItem toEntity(LineItemDTO dto);

    // Map Entity to DTO (single object)
    @Named("toDTO")
    @Mapping(target = "product", source = "product.productId")
    LineItemDTO toDTO(LineItem entity);

    // Map DTO list to Entity list
    @IterableMapping(qualifiedByName = "toEntity")
    List<LineItem> toEntityList(List<LineItemDTO> dtos);

    // Map Entity list to DTO list
    @IterableMapping(qualifiedByName = "toDTO")
    List<LineItemDTO> toDTOsList(List<LineItem> entities);

    // Qualifier method for Product (String -> Product)
    @Named("mapProductId")
    default Product mapProductId(String productId) {
        Product product = new Product();
        product.setProductId(productId);
        return product;
    }

}
