package com.group03.backend_PharmaPulse.purchase.internal.mapper;


import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseLineItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;



import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseLineItemMapper {

    // Map DTO to Entity
    @Mapping(target = "lineItemId", ignore = true)
    PurchaseLineItem toEntity(PurchaseLineItemDTO dto);

    // Map Entity to DTO
    PurchaseLineItemDTO toDTO(PurchaseLineItem entity);

    List<PurchaseLineItemDTO> toDTOsList(List<PurchaseLineItem> entities);
    List<PurchaseLineItem> toEntityList(List<PurchaseLineItemDTO> dtos);

}
