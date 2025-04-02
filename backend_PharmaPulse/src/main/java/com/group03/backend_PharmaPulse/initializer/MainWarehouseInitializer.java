package com.group03.backend_PharmaPulse.initializer;

import com.group03.backend_PharmaPulse.inventory.api.InventoryLocationService;
import com.group03.backend_PharmaPulse.inventory.api.dto.InventoryLocationDTO;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import static com.group03.backend_PharmaPulse.inventory.api.enumeration.LocationType.WAREHOUSE;

@Component
public class MainWarehouseInitializer implements CommandLineRunner {
    private final InventoryLocationService inventoryLocationService;

    public MainWarehouseInitializer(InventoryLocationService inventoryLocationService) {
        this.inventoryLocationService = inventoryLocationService;
    }

    @Override
    public void run(String... args) throws Exception {
        try{
            InventoryLocationDTO inventoryLocationDTO = new InventoryLocationDTO();
            inventoryLocationDTO.setLocationType(WAREHOUSE);
            inventoryLocationDTO.setLocationName("Main Warehouse");
            inventoryLocationDTO.setTotalCapacity(1000);
            inventoryLocationDTO.setAvailableCapacity(1000);
            inventoryLocationService.addInventoryLocation(inventoryLocationDTO);
        }catch (IllegalArgumentException ex){
            System.out.println("Main warehouse already exists");
        }
    }
}
