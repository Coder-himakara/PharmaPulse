package com.group03.backend_PharmaPulse.purchase.internal.mapper;


import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.api.dto.response.PurchaseInvoiceResponse;
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

    @Mapping(target = "invoiceId", source = "invoiceId")
    @Mapping(target = "lineItems", source = "lineItems")
    PurchaseInvoiceResponse toResponseDTO(PurchaseInvoice purchaseInvoice);

    @Mapping(target = "invoiceId", source = "invoiceId")
    @Mapping(target = "lineItems", source = "lineItems")
    List<PurchaseInvoiceResponse> toResponseDTOsList(List<PurchaseInvoice> purchaseInvoices);
}
