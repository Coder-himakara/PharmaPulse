package com.group03.backend_PharmaPulse.purchase.mapper;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseInvoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseInvoiceMapper {
    @Mapping(target = "invoiceId" ,ignore = true)
    @Mapping(target = "lineItems" ,ignore = true)
    PurchaseInvoice toEntity(PurchaseInvoiceDTO purchaseInvoiceDTO);
    PurchaseInvoiceDTO toDTO(PurchaseInvoice purchaseInvoice);
    List<PurchaseInvoiceDTO> toDTOsList(List<PurchaseInvoice> purchaseInvoices);
}
