package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementDTO;

public interface StockTransferService {
    StockMovementDTO processStockTransfer(StockMovementDTO stockMovementDTO);
}
