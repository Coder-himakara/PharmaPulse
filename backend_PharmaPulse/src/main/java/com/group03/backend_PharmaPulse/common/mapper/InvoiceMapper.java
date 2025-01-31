package com.group03.backend_PharmaPulse.common.mapper;

import com.group03.backend_PharmaPulse.common.dto.InvoiceDTO;
import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    @Mapping(target = "invoiceId" ,ignore = true)
    Invoice toEntity(InvoiceDTO invoiceDTO);

    InvoiceDTO toDTO(Invoice invoice);

    List<InvoiceDTO> toDTOsList(List<Invoice> invoices);

    // Custom mapping methods
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
