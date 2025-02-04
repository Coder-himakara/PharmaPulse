package com.group03.backend_PharmaPulse.purchase.internal.mapper;


import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseInvoice;
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
}
