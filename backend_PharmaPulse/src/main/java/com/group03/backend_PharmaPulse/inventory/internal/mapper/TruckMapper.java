package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.TruckDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Truck;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TruckMapper {
    @Mapping(target = "id", ignore = true) // ID is auto-generated, so we ignore it
    Truck toEntity(TruckDTO truckDTO);
    TruckDTO toDTO(Truck truck);
}
