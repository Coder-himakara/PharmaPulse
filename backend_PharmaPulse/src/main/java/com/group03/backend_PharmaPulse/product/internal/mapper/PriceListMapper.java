package com.group03.backend_PharmaPulse.product.internal.mapper;

import com.group03.backend_PharmaPulse.product.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductWholesalePrice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PriceListMapper {
    @Mapping(target = "productRefId", source = "product.productRefId")
    @Mapping(target = "purchaseGroupId", source = "product.purchaseGroupId")
    @Mapping(target = "productName", source = "product.productName")
    @Mapping(target = "genericName", source = "product.genericName")
    @Mapping(target = "unitsPerPack", source = "product.unitsPerPack")
    @Mapping(target = "wholesalePrice", source = "price.wholesalePrice")
    PriceListDTO toDTO(Product product, ProductWholesalePrice price);
}