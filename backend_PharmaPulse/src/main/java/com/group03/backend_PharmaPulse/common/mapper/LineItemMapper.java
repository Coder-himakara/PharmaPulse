package com.group03.backend_PharmaPulse.common.mapper;

import com.group03.backend_PharmaPulse.common.dto.LineItemDTO;
import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LineItemMapper {
    @Mapping(target = "lineItemId" ,ignore = true)
    @Mapping(target = "product" ,source = "product" ,qualifiedByName = "mapProduct")
    @Mapping(target = "invoice" ,source = "invoice" ,qualifiedByName = "mapInvoice")
    LineItem toEntity(LineItemDTO lineItemDTO);

    @Mapping(target = "product" ,source = "product.productId")
    @Mapping(target = "invoice" ,source = "invoice.invoiceId")
    LineItemDTO toDTO(LineItem lineItem);

    List<LineItemDTO> toDTOsList(List<LineItem> lineItems);

    @Mapping(target = "lineItemId" ,ignore = true)
    @Mapping(target = "product" ,source = "product" ,qualifiedByName = "mapProduct")
    @Mapping(target = "invoice" ,source = "invoice" ,qualifiedByName = "mapInvoice")
    List<LineItem> toEntityList(List<LineItemDTO> lineItemDTOS);
    @Named("mapProduct")
    default Product mapProduct(String product_id) {
        Product product = new Product();
        product.setProductId(product_id);
        return product;
    }
    @Named("mapInvoice")
    default Invoice mapInvoice(Long invoiceId) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(invoiceId);
        return invoice;
    }
}
