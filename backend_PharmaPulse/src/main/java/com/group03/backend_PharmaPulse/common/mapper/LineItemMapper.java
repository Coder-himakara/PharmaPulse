package com.group03.backend_PharmaPulse.common.mapper;

import com.group03.backend_PharmaPulse.common.dto.LineItemDTO;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LineItemMapper {
    @Mapping(target = "lineItemId" ,ignore = true)
    @Mapping(target = "invoice" ,ignore = true)
    @Mapping(target = "product" ,source = "product" ,qualifiedByName = "mapProduct")
    LineItem toEntity(LineItemDTO lineItemDTO);

    @Mapping(target = "product" ,source = "product.product_id")
    LineItemDTO toDTO(LineItem lineItem);

    List<LineItemDTO> toDTOsList(List<LineItem> lineItems);
    @Named("mapProduct")
    default Product mapProduct(String product_id) {
        Product product = new Product();
        product.setProduct_id(product_id);
        return product;
    }
}
