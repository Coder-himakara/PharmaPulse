package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.TruckDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.TruckResponseDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Truck;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TruckMapper {
    @Mapping(target = "id", ignore = true) // ID is auto-generated, so we ignore it
    @Mapping(target = "currentCapacity", ignore = true)
    Truck toEntity(TruckDTO truckDTO);

    TruckDTO toDTO(Truck truck);
    TruckResponseDTO toResponseDTO(Truck truck);
    Truck toEntityFromResponse(TruckResponseDTO truckResponseDTO);
    List<TruckResponseDTO> toResponseDTOList(List<Truck> trucks);
}
