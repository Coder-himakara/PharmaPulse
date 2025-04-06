package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementLineDTO;

import java.util.List;
import java.util.Map;

public interface StockMovementService {
    Map<String, List<StockMovementLineDTO>> checkTransferRequest(StockMovementDTO stockMovementDTO);
    void saveStockMovement(StockMovementDTO stockMovementDTO);
}
