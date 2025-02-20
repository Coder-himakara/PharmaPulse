package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.InventoryLocationDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryLocationResponse;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InventoryLocationMapper {
    @Mapping(target = "locationId",ignore = true)
    @Mapping(target = "inventories", ignore = true)
    InventoryLocation toEntity(InventoryLocationDTO inventoryLocationDTO);

    InventoryLocationDTO toDTO(InventoryLocation inventoryLocation);

    InventoryLocationResponse toResponseDTO(InventoryLocation inventoryLocation);

    List<InventoryLocationResponse> toResponseDTOsList(List<InventoryLocation> inventoryLocations);
}
