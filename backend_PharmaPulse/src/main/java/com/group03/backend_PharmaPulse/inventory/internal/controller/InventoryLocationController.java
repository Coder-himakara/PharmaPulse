package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.InventoryLocationService;
import com.group03.backend_PharmaPulse.inventory.api.dto.InventoryLocationDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryLocationResponse;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/inventory-location")
public class InventoryLocationController {
    private final InventoryLocationService inventoryLocationService;

    public InventoryLocationController(InventoryLocationService inventoryLocationService) {
        this.inventoryLocationService = inventoryLocationService;
    }
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllInventoryLocations() {
        List<InventoryLocationResponse> inventoryLocationResponseList  = inventoryLocationService
                .getAllInventoryLocations();
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",inventoryLocationResponseList),
                HttpStatus.OK
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getInventoryLocationById(@PathVariable Long id) {
        InventoryLocationResponse selectedInventoryLocation = inventoryLocationService.getInventoryLocationById(id);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",selectedInventoryLocation),
                HttpStatus.FOUND
        );
    }
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addInventoryLocation(@RequestBody InventoryLocationDTO
                                                                             inventoryLocationDTO) {
        InventoryLocationResponse savedInventoryLocation = inventoryLocationService.
                addInventoryLocation(inventoryLocationDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedInventoryLocation),
                HttpStatus.CREATED
        );
    }
}
