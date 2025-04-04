package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.InventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryResponseDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Inventory;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.InventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.InventoryRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {
    private final InventoryRepo inventoryRepo;
    private final InventoryMapper inventoryMapper;

    public InventoryServiceImpl(InventoryRepo inventoryRepo,InventoryMapper inventoryMapper) {
        this.inventoryRepo = inventoryRepo;
        this.inventoryMapper = inventoryMapper;
    }
    @Override
    public List<InventoryResponseDTO> getAllInventories() {
        List<Inventory> inventories = inventoryRepo.findAll();
        if(!inventories.isEmpty()){
            return inventoryMapper.toResponseDTOList(inventories);
        }else{
            throw new NotFoundException("No inventories found");
        }
    }
}
