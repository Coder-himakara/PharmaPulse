package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.StockMovement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StockMovementMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lineList", ignore = true)
    StockMovement toEntity(StockMovementDTO stockMovementDTO);

    @Mapping(target = "lineList", ignore = true)
    StockMovementDTO toDTO(StockMovement stockMovement);
}
