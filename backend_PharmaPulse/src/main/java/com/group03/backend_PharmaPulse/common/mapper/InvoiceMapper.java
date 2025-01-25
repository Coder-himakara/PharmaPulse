package com.group03.backend_PharmaPulse.common.mapper;

import com.group03.backend_PharmaPulse.common.dto.InvoiceDTO;
import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.common.entity.LineItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    @Mapping(target = "invoiceId" ,ignore = true)
    @Mapping(target = "lineItems" ,ignore = true)
    Invoice toEntity(InvoiceDTO invoiceDTO);
    InvoiceDTO toDTO(Invoice invoice);
    List<InvoiceDTO> toDTOsList(List<LineItem> lineItems);
}
