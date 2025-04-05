package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryDetailsDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryResponseDTO;

import java.util.List;

public interface InventoryService {
    List<InventoryResponseDTO> getAllInventories();
    List<InventoryDetailsDTO> getInventoryDetails();
}
