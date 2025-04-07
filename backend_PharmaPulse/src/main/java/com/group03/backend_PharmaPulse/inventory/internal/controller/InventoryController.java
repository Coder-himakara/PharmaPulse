package com.group03.backend_PharmaPulse.inventory.internal.controller;


import com.group03.backend_PharmaPulse.inventory.api.InventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.ProductAvailabilityDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryDetailsDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryResponseDTO;
import com.group03.backend_PharmaPulse.inventory.internal.serviceImpl.InventoryReservationServiceImpl;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("api/inventory")
@PreAuthorize("hasAnyRole('EMPLOYEE','SALES_REP')")
public class InventoryController {

    private final InventoryReservationServiceImpl inventoryReservationService;
    private final InventoryService inventoryService;

    public InventoryController(InventoryReservationServiceImpl inventoryReservationService,
                               InventoryService inventoryService) {
        this.inventoryReservationService = inventoryReservationService;
        this.inventoryService = inventoryService;
    }

    /**
     * Endpoint to return available quantities for all products.
     */
    @GetMapping("/all-available")
    @PreAuthorize("hasAuthority('sales_rep:read')")
    public List<ProductAvailabilityDTO> getAllAvailableQuantities() {
        return inventoryReservationService.getAllProductAvailabilities();
    }

    /**
     * Endpoint to return the available quantity for a specific product by productId.
     */
    @GetMapping("/available-quantity/{productId}")
    @PreAuthorize("hasAuthority('sales_rep:read')")
    public int getAvailableQuantity(@PathVariable Long productId) {
        return inventoryReservationService.getAvailableQuantityByProductId(productId);
    }

//    @GetMapping("/all")
//    @PreAuthorize("hasAuthority('employee:read')")
//    public ResponseEntity<StandardResponse> getAllInventories() {
//        List<InventoryResponseDTO> inventories = inventoryService.getAllInventories();
//        return new ResponseEntity<>(
//                new StandardResponse(200,"Success",inventories),
//                HttpStatus.OK
//        );
//    }
    @GetMapping("/details")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getInventoryDetails() {
        List<InventoryDetailsDTO> inventoryDetails = inventoryService.getInventoryDetails();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",inventoryDetails),
                HttpStatus.OK
        );
    }
}
