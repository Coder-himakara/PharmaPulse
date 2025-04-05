package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.InventoryLocationService;
import com.group03.backend_PharmaPulse.inventory.api.StockMovementLineService;
import com.group03.backend_PharmaPulse.inventory.api.StockMovementService;
import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementLineDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryLocationResponse;
import com.group03.backend_PharmaPulse.inventory.internal.entity.StockMovement;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.StockMovementMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.StockMovementRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StockMovementServiceImpl implements StockMovementService {
    private final InventoryLocationService inventoryLocationService;
    private final StockMovementRepo stockMovementRepo;
    private final StockMovementMapper stockMovementMapper;
    private final StockMovementLineService stockMovementLineService;

    public StockMovementServiceImpl(InventoryLocationService inventoryLocationService,
                                    StockMovementMapper stockMovementMapper,
                                    StockMovementLineService stockMovementLineService,
                                    StockMovementRepo stockMovementRepo) {
        this.inventoryLocationService = inventoryLocationService;
        this.stockMovementRepo = stockMovementRepo;
        this.stockMovementMapper = stockMovementMapper;
        this.stockMovementLineService = stockMovementLineService;
    }

    @Override
    @Transactional
    public Map<String, List<StockMovementLineDTO>> checkTransferRequest(StockMovementDTO stockMovementDTO) {
        if (stockMovementDTO.getLineList() == null || stockMovementDTO.getLineList().isEmpty()) {
            throw new IllegalArgumentException("Stock movement lines cannot be empty");
        }

        Map<String, List<StockMovementLineDTO>> groupedTransfers = new HashMap<>();

        // Group line items by source and target location combinations
        for (StockMovementLineDTO lineItem : stockMovementDTO.getLineList()) {
            String sourceLocation = lineItem.getSourceLocation();
            String targetLocation = lineItem.getTargetLocation();
            InventoryLocationResponse sourceLocationDTO = inventoryLocationService
                    .getInventoryLocationByName(sourceLocation);
            InventoryLocationResponse targetLocationDTO = inventoryLocationService
                    .getInventoryLocationByName(targetLocation);

            String sourceLocationType = sourceLocationDTO.getLocationType().toString();
            String targetLocationType = targetLocationDTO.getLocationType().toString();
            String transferType = sourceLocationType + "_TO_" + targetLocationType;

            // Check if it's a supported transfer type (WAREHOUSE<->TRUCK)
            if (("WAREHOUSE".equals(sourceLocationType) && "TRUCK".equals(targetLocationType)) ||
                    ("TRUCK".equals(sourceLocationType) && "WAREHOUSE".equals(targetLocationType))) {

                // Add to appropriate group
                groupedTransfers.computeIfAbsent(transferType, k -> new ArrayList<>()).add(lineItem);
            } else {
                throw new IllegalArgumentException("Unsupported transfer type: " +
                        sourceLocationType + " to " + targetLocationType);
            }
        }
        return groupedTransfers;
    }

    //Here add the method to save StockMovement into the database
    @Override
    @Transactional
    public void saveStockMovement(StockMovementDTO stockMovementDTO) {
        StockMovement stockMovement = stockMovementMapper.toEntity(stockMovementDTO);
        StockMovement savedStockMovement = stockMovementRepo.save(stockMovement);

        if (stockMovementRepo.existsById(savedStockMovement.getId())) {
            List<StockMovementLineDTO> stockMovementLines = stockMovementDTO.getLineList();
            for (StockMovementLineDTO lineItem : stockMovementLines) {
                lineItem.setStockMovement(savedStockMovement.getId());
            }
            if (!stockMovementLines.isEmpty()) {
                // Add the Stock Movement Lines to the database
                stockMovementLineService.addLineItems(stockMovementLines);
            } else {
                throw new IllegalArgumentException("Stock Movement Lines not found");
            }
        } else {
            throw new IllegalArgumentException("Stock Movement not found");
        }
    }
}
