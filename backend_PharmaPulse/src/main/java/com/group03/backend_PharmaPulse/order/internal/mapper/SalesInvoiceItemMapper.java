package com.group03.backend_PharmaPulse.order.internal.mapper;

import com.group03.backend_PharmaPulse.order.api.dto.SalesInvoiceItemDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.SalesInvoiceItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SalesInvoiceItemMapper {
    SalesInvoiceItemDTO toDTO(SalesInvoiceItem item);
    @Mapping(target = "salesInvoice", ignore = true)
    SalesInvoiceItem toEntity(SalesInvoiceItemDTO dto);
    List<SalesInvoiceItemDTO> toDTOList(List<SalesInvoiceItem> items);
}
