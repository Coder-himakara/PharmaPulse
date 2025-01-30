package com.group03.backend_PharmaPulse.inventory.mapper;

import com.group03.backend_PharmaPulse.inventory.dto.ProductRetailPriceDTO;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.inventory.entity.ProductRetailPrice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductRetailPriceMapper {
    @Mapping(target = "product", source = "product.productId")
    ProductRetailPriceDTO toDTO(ProductRetailPrice productRetailPrice);

    @Mapping(target = "priceId",ignore = true)
    @Mapping(target = "product", source = "product", qualifiedByName = "mapProduct")
    ProductRetailPrice toEntity(ProductRetailPriceDTO productRetailPriceDTO);

    List<ProductRetailPriceDTO> toDTOsList(List<ProductRetailPrice> productRetailPrices);

    @Named("mapProduct")
    default Product mapProduct(String productId) {
        Product product = new Product();
        product.setProductId(productId);
        return product;
    }

}
