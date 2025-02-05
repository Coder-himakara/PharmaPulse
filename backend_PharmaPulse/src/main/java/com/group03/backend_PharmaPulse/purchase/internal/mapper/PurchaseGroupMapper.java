package com.group03.backend_PharmaPulse.purchase.internal.mapper;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseGroupMapper {
    @Mapping(target = "purchaseGroupId" ,ignore = true)
    @Mapping(target = "suppliers" ,ignore = true)
    PurchaseGroup toEntity(PurchaseGroupDTO purchaseGroupDTO);

    PurchaseGroupDTO toDTO(PurchaseGroup purchaseGroup);

    List<PurchaseGroupDTO> toDTOsList(List<PurchaseGroup> purchaseGroups);
}
