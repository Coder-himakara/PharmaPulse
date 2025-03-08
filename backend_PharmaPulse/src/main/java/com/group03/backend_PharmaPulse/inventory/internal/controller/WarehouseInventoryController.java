package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.WarehouseInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/warehouse-inventory")
public class WarehouseInventoryController {
    private final WarehouseInventoryService warehouseInventoryService;

    public WarehouseInventoryController(WarehouseInventoryService warehouseInventoryService) {
        this.warehouseInventoryService = warehouseInventoryService;
    }

    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllWarehouseInventories() {
        List<WarehouseInventoryDTO> warehouseInventoryDTOS = warehouseInventoryService.getAllWarehouseInventories();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", warehouseInventoryDTOS),
                HttpStatus.OK
        );
    }
}