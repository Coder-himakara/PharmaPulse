package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryResponseDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Inventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InventoryMapper {

    @Mapping(target = "location" ,source = "location", qualifiedByName = "mapInventoryLocation")
    @Mapping(target = "batch",source = "batch", qualifiedByName = "mapBatchInventory")
    Inventory toEntity(InventoryResponseDTO inventoryDTO);

    @Mapping(target = "location", source = "location.locationId")
    @Mapping(target = "batch", source = "batch.batchId")
    InventoryResponseDTO toResponseDTO(Inventory inventory);

    List<InventoryResponseDTO> toResponseDTOList(List<Inventory> inventoryList);
    List<Inventory> toEntityList(List<InventoryResponseDTO> inventoryDTOList);

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
