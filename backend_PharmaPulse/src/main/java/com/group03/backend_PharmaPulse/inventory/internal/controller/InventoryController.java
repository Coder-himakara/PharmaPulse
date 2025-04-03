package com.group03.backend_PharmaPulse.inventory.internal.controller;


import com.group03.backend_PharmaPulse.inventory.api.dto.ProductAvailabilityDTO;
import com.group03.backend_PharmaPulse.inventory.internal.serviceImpl.InventoryReservationServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("api/inventory")
public class InventoryController {

    private final InventoryReservationServiceImpl inventoryService;

    public InventoryController(InventoryReservationServiceImpl inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Endpoint to return available quantities for all products.
     */
    @GetMapping("/all-available")
    public List<ProductAvailabilityDTO> getAllAvailableQuantities() {
        return inventoryService.getAllProductAvailabilities();
    }

    /**
     * Endpoint to return the available quantity for a specific product by productId.
     */
    @GetMapping("/available-quantity/{productId}")
    public int getAvailableQuantity(@PathVariable Long productId) {
        return inventoryService.getAvailableQuantityByProductId(productId);
    }
}
