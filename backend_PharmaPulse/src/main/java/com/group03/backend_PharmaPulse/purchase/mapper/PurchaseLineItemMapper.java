package com.group03.backend_PharmaPulse.purchase.mapper;

import com.group03.backend_PharmaPulse.common.mapper.LineItemMapper;
import com.group03.backend_PharmaPulse.purchase.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseLineItem;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


import java.util.List;

@Mapper(
        componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        uses = LineItemMapper.class // Reuse qualifiers from LineItemMapper
)
public interface PurchaseLineItemMapper {

    // Map DTO to Entity
    @Mapping(target = "lineItemId", ignore = true)
    @Mapping(target = "product", source = "product", qualifiedByName = "mapProductId") // String → Product
    @Mapping(target = "invoice", source = "invoice", qualifiedByName = "mapInvoiceId") // Long → Invoice
    @Mapping(target = "costPerUnit", source = "costPerUnit")
    @Mapping(target = "totalCost", source = "totalCost")
    @Mapping(target = "manufactureDate", source = "manufactureDate")
    @Mapping(target = "expiryDate", source = "expiryDate")
    @Mapping(target = "unitPrice", source = "unitPrice")
    PurchaseLineItem toEntity(PurchaseLineItemDTO dto);

    // Map Entity to DTO
    @Mapping(target = "product", source = "product.productId") // Product → String
    @Mapping(target = "invoice", source = "invoice.invoiceId") // Invoice → Long
    @Mapping(target = "costPerUnit", source = "costPerUnit")
    @Mapping(target = "totalCost", source = "totalCost")
    @Mapping(target = "manufactureDate", source = "manufactureDate")
    @Mapping(target = "expiryDate", source = "expiryDate")
    @Mapping(target = "unitPrice", source = "unitPrice")
    PurchaseLineItemDTO toDTO(PurchaseLineItem entity);

    List<PurchaseLineItemDTO> toDTOsList(List<PurchaseLineItem> entities);
}
