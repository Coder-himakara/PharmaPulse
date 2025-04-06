package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.TruckInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import com.group03.backend_PharmaPulse.inventory.internal.entity.TruckInventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TruckInventoryMapper {

    @Mapping(target = "inventoryId",ignore = true)
    @Mapping(target = "location" ,source = "location", qualifiedByName = "mapInventoryLocation")
    @Mapping(target = "batch",source = "batch", qualifiedByName = "mapBatchInventory")
    TruckInventory toEntity(TruckInventoryDTO dto);

    @Mapping(target = "location", source = "location.locationId")
    @Mapping(target = "batch", source = "batch.batchId")
    TruckInventoryDTO toDTO(TruckInventory entity);

    List<TruckInventory> toEntityList(List<TruckInventoryDTO> dtoList);
    List<TruckInventoryDTO> toDTOList(List<TruckInventory> entityList);

    @Named("mapInventoryLocation")
    default InventoryLocation mapInventoryLocation(Long locationId){
        InventoryLocation inventoryLocation = new InventoryLocation();
        inventoryLocation.setLocationId(locationId);
        return inventoryLocation;
    }
    @Named("mapBatchInventory")
    default BatchInventory mapBatchInventory(Long batchId){
        BatchInventory batchInventory = new BatchInventory();
        batchInventory.setBatchId(batchId);
        return batchInventory;
    }
}
