package com.group03.backend_PharmaPulse.order.internal.mapper;

import com.group03.backend_PharmaPulse.order.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.PriceList;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PriceListMapper {
    PriceListDTO toDTO(PriceList priceList);
    PriceList toEntity(PriceListDTO priceListDTO);
    List<PriceListDTO> toDTOList(List<PriceList> priceLists);
}
