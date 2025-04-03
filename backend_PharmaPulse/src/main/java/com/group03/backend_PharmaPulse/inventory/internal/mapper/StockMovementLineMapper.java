package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementLineDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.StockMovementLine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StockMovementLineMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "stockMovement",ignore = true)
    @Mapping(target = "batch" ,source = "batch",qualifiedByName = "mapBatch")
    StockMovementLine toEntity(StockMovementLineDTO dto);

    @Mapping(target = "batch", source = "batch.batchId")
    @Mapping(target = "stockMovement",ignore = true)
    StockMovementLineDTO toDTO(StockMovementLine entity);

    List<StockMovementLine> toEntityList(List<StockMovementLineDTO> dto);
    List<StockMovementLineDTO> toDTOList(List<StockMovementLine> entity);

    @Named("mapBatch")
    default BatchInventory mapBatch(Long batchId) {
        BatchInventory batch = new BatchInventory();
        batch.setBatchId(batchId);
        return batch;
    }
}
