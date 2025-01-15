package com.group03.backend_PharmaPulse.purchase.mapper;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseGroupMapper {
    PurchaseGroup toEntity(PurchaseGroupDTO purchaseGroupDTO);
    PurchaseGroupDTO toDTO(PurchaseGroup purchaseGroup);
    List<PurchaseGroupDTO> toDTOsList(List<PurchaseGroup> purchaseGroups);
}
