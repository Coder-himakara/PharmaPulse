package com.group03.backend_PharmaPulse.order.internal.mapper;

import com.group03.backend_PharmaPulse.order.api.dto.SalesInvoiceDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.SalesInvoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {SalesInvoiceItemMapper.class})
public interface SalesInvoiceMapper {
    @Mapping(target = "invoiceItems", source = "invoiceItems")
    SalesInvoiceDTO toDTO(SalesInvoice salesInvoice);

    @Mapping(target = "invoiceItems", source = "invoiceItems")
    SalesInvoice toEntity(SalesInvoiceDTO salesInvoiceDTO);

    List<SalesInvoiceDTO> toDTOList(List<SalesInvoice> salesInvoices);
}
