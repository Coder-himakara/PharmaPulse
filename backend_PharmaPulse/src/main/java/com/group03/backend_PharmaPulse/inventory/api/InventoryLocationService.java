package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.InventoryLocationDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryLocationResponse;

import java.util.List;

public interface InventoryLocationService {
    InventoryLocationResponse addInventoryLocation(InventoryLocationDTO inventoryLocationDTO);
    InventoryLocationResponse getInventoryLocationById(Long id);
    List<InventoryLocationResponse> getAllInventoryLocations();
    InventoryLocationResponse getInventoryLocationByName(String locationName);
}
