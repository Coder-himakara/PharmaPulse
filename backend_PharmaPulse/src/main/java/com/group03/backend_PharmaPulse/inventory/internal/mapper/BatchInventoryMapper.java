package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BatchInventoryMapper {
    @Mapping(target = "batchId",ignore = true)
    @Mapping(target = "purchaseInvoice", ignore = true)
    @Mapping(target = "inventoryRecords",ignore = true)
    BatchInventory toEntity(BatchInventoryDTO batchInventoryDTO);
    //new
    void updateBatchFromDto(BatchInventoryDTO dto, @MappingTarget BatchInventory entity);


    BatchInventoryDTO toDTO(BatchInventory batchInventory);

    List<BatchInventoryDTO> toDTOsList(List<BatchInventory> batchInventories);
    List<BatchInventory> toEntityList(List<BatchInventoryDTO> batchInventoryDTOS);
}
