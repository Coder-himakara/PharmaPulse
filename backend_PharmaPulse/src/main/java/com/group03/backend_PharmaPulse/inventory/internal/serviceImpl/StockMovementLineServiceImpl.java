package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.StockMovementLineService;
import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementLineDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.StockMovementLine;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.StockMovementLineMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.StockMovementLineRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockMovementLineServiceImpl implements StockMovementLineService {
    private final StockMovementLineRepo stockMovementLineRepo;
    private final StockMovementLineMapper stockMovementLineMapper;

    public StockMovementLineServiceImpl(StockMovementLineRepo stockMovementLineRepo,
                                        StockMovementLineMapper stockMovementLineMapper) {
        this.stockMovementLineRepo = stockMovementLineRepo;
        this.stockMovementLineMapper = stockMovementLineMapper;
    }
    @Override
    public void addLineItems(List<StockMovementLineDTO> stockMovementLineDTOList) {
        List<StockMovementLine> stockMovementLines = stockMovementLineMapper.toEntityList(stockMovementLineDTOList);
        stockMovementLineRepo.saveAll(stockMovementLines);
    }
}
