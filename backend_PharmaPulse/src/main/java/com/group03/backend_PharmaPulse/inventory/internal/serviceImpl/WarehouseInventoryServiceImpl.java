package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.WarehouseInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.repository.WarehouseInventoryRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseInventoryServiceImpl implements WarehouseInventoryService {
    private final WarehouseInventoryRepo warehouseInventoryRepo;

    public WarehouseInventoryServiceImpl(WarehouseInventoryRepo warehouseInventoryRepo) {
        this.warehouseInventoryRepo = warehouseInventoryRepo;
    }

    @Override
    public List<WarehouseInventoryDTO> getAllWarehouseInventories() {
        List<WarehouseInventoryDTO> warehouseInventories = warehouseInventoryRepo.findAllWarehouseInventoryDetails();
        if (!warehouseInventories.isEmpty()) {
            return warehouseInventories;
        } else {
            throw new NotFoundException("No Warehouse Inventories found");
        }
    }
}