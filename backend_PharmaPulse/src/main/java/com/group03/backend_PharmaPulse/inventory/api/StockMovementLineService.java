package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementLineDTO;

import java.util.List;

public interface StockMovementLineService {
    void addLineItems(List<StockMovementLineDTO> stockMovementLineDTOList);
}
