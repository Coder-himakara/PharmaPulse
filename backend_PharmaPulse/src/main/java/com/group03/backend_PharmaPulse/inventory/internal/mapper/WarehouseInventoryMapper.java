package com.group03.backend_PharmaPulse.inventory.internal.mapper;

import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import com.group03.backend_PharmaPulse.inventory.internal.entity.WarehouseInventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WarehouseInventoryMapper {
    @Mapping(target = "inventoryId",ignore = true)
    @Mapping(target = "location" ,source = "location", qualifiedByName = "mapInventoryLocation")
    @Mapping(target = "batch",source = "batch", qualifiedByName = "mapBatchInventory")
    WarehouseInventory toEntity(WarehouseInventoryDTO warehouseInventoryDTO);

    @Mapping(target = "location", source = "location.locationId")
    @Mapping(target = "batch", source = "batch.batchId")
    WarehouseInventoryDTO toDTO(WarehouseInventory warehouseInventory);

    List<WarehouseInventory> toEntityList(List<WarehouseInventoryDTO> warehouseInventoryDTOS);
    List<WarehouseInventoryDTO> toDTOsList(List<WarehouseInventory> warehouseInventories);

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
