package com.group03.backend_PharmaPulse.product.internal.mapper;

import com.group03.backend_PharmaPulse.product.api.dto.ProductWholesalePriceDTO;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductWholesalePrice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductWholesalePriceMapper {
    @Mapping(target = "product", source = "product.productId")
    ProductWholesalePriceDTO toDTO(ProductWholesalePrice productWholesalePrice);

    @Mapping(target = "priceId",ignore = true)
    @Mapping(target = "product", source = "product", qualifiedByName = "mapProduct")
    ProductWholesalePrice toEntity(ProductWholesalePriceDTO productWholesalePriceDTO);

    List<ProductWholesalePriceDTO> toDTOsList(List<ProductWholesalePrice> productWholesalePrices);
    List<ProductWholesalePrice> toEntitiesList(List<ProductWholesalePriceDTO> productWholesalePriceDTOS);

    @Named("mapProduct")
    default Product mapProduct(Long productId){
        Product product = new Product();
        product.setProductId(productId);
        return product;

    }
}
