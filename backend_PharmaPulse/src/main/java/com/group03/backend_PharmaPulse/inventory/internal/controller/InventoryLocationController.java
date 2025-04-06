package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.InventoryLocationService;
import com.group03.backend_PharmaPulse.inventory.api.dto.InventoryLocationDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryLocationResponse;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/inventory-location")
@PreAuthorize("hasRole('EMPLOYEE')")
public class InventoryLocationController {
    private final InventoryLocationService inventoryLocationService;

    public InventoryLocationController(InventoryLocationService inventoryLocationService) {
        this.inventoryLocationService = inventoryLocationService;
    }
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getAllInventoryLocations() {
        List<InventoryLocationResponse> inventoryLocationResponseList  = inventoryLocationService
                .getAllInventoryLocations();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",inventoryLocationResponseList),
                HttpStatus.OK
        );
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getInventoryLocationById(@PathVariable Long id) {
        InventoryLocationResponse selectedInventoryLocation = inventoryLocationService.getInventoryLocationById(id);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",selectedInventoryLocation),
                HttpStatus.OK
        );
    }
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('employee:create')")
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
