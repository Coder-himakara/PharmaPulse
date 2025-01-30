package com.group03.backend_PharmaPulse.purchase.mapper;

import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.common.mapper.InvoiceMapper;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.purchase.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseInvoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseInvoiceMapper{
    @Mapping(target = "invoiceId" ,ignore = true)
    @Mapping(target = "lineItems" ,ignore = true)
    @Mapping(target = "supplier" ,ignore = true)
    PurchaseInvoice toEntity(PurchaseInvoiceDTO purchaseInvoiceDTO);
    @Mapping(target = "lineItemsList", ignore = true)
    PurchaseInvoiceDTO toDTO(PurchaseInvoice purchaseInvoice);
    @Mapping(target = "lineItemsList", ignore = true)
    List<PurchaseInvoiceDTO> toDTOsList(List<PurchaseInvoice> purchaseInvoices);

    default Long map(Invoice value) {
        return value != null ? value.getInvoiceId() : null;
    }

    default Invoice map(Long value) {
        if (value == null) {
            return null;
        }
        Invoice invoice = new Invoice();
        invoice.setInvoiceId(value);
        return invoice;
    }

    default String map(Product value) {
        return value != null ? value.getProductId() : null;
    }

    default Product map(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        Product product = new Product();
        product.setProductId(value);
        return product;
    }
}
