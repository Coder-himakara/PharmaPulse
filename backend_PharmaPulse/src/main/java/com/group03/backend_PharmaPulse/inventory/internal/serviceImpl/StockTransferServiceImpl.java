package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.*;
import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementLineDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.TruckInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;


@Service
public class StockTransferServiceImpl implements StockTransferService {
    private final TruckInventoryService truckInventoryService;
    private final WarehouseInventoryService warehouseInventoryService;
    private final StockMovementService stockMovementService;
    private final InventoryLocationService inventoryLocationService;

    public StockTransferServiceImpl(TruckInventoryService truckInventoryService,
                                    WarehouseInventoryService warehouseInventoryService,
                                    StockMovementService stockMovementService,
                                    InventoryLocationService inventoryLocationService) {
        this.truckInventoryService = truckInventoryService;
        this.warehouseInventoryService = warehouseInventoryService;
        this.stockMovementService = stockMovementService;
        this.inventoryLocationService = inventoryLocationService;
    }

    @Override
    @Transactional
    public StockMovementDTO processStockTransfer(StockMovementDTO stockMovementDTO) {
        try {
            if (stockMovementDTO == null) {
                throw new IllegalArgumentException("Stock movement request cannot be null");
            }
            // Step 1: Use the StockMovementService to validate and group line items
            Map<String, List<StockMovementLineDTO>> groupedTransfers;
            try {
                groupedTransfers = stockMovementService.checkTransferRequest(stockMovementDTO);
            } catch (Exception e) {
                throw new IllegalArgumentException("Failed to validate transfer request: " + e.getMessage(), e);
            }
            if (groupedTransfers == null || groupedTransfers.isEmpty()) {
                throw new IllegalArgumentException("No valid transfers found in the request");
            }
            // Step 2: Process each group of transfers
            for (Map.Entry<String, List<StockMovementLineDTO>> entry : groupedTransfers.entrySet()) {
                String transferType = entry.getKey();
                List<StockMovementLineDTO> lineItems = entry.getValue();

                if (lineItems == null || lineItems.isEmpty()) {
                    continue; // Skip empty groups
                }
                // Process based on transfer direction
                if ("WAREHOUSE_TO_TRUCK".equals(transferType)) {
                    processWarehouseToTruckTransfer(lineItems);
                } else if ("TRUCK_TO_WAREHOUSE".equals(transferType)) {
                    processTruckToWarehouseTransfer(lineItems);
                } else {
                    throw new IllegalArgumentException("Unsupported transfer type: " + transferType);
                }
            }
            // Step 3: Create and save the StockMovement record
            try {
                stockMovementService.saveStockMovement(stockMovementDTO);
            } catch (Exception e) {
                throw new RuntimeException("Failed to save stock movement: " + e.getMessage(), e);
            }
            return stockMovementDTO;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error processing stock transfer: " + e.getMessage(), e);
        }
    }

    private void processTruckToWarehouseTransfer(List<StockMovementLineDTO> lineItems) {
        for (StockMovementLineDTO item : lineItems) {
            // Get source truck details
            Long truckLocationId = inventoryLocationService
                    .getInventoryLocationByName(item.getSourceLocation()).getLocationId();
            String truckRegistrationNumber = item.getSourceLocation();

            // Get target warehouse details
            Long warehouseLocationId = inventoryLocationService
                    .getInventoryLocationByName(item.getTargetLocation()).getLocationId();

            // Get current truck inventory
            TruckInventoryDTO truckDTO = truckInventoryService
                    .getTruckInventoryByBatchAndLocation(item.getBatch(), truckLocationId);
            // Check if truck has sufficient quantity to transfer
            if (truckDTO.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient quantity in truck for batch " + item.getBatch());
            }

            // Create updated truck inventory with reduced quantity
            TruckInventoryDTO updatedTruckDTO = new TruckInventoryDTO();
            updatedTruckDTO.setBatch(item.getBatch());
            updatedTruckDTO.setLocation(truckLocationId);
            updatedTruckDTO.setRegistrationNumber(truckRegistrationNumber);
            updatedTruckDTO.setQuantity(-item.getQuantity()); // Negative quantity for reduction

            truckInventoryService.addOrUpdateTruckInventory(updatedTruckDTO);

            // Update warehouse inventory (increase quantity)
            WarehouseInventoryDTO warehouseDTO = new WarehouseInventoryDTO();
            warehouseDTO.setBatch(item.getBatch());
            warehouseDTO.setLocation(warehouseLocationId);
            warehouseDTO.setQuantity(item.getQuantity()); // Positive quantity for addition

            warehouseInventoryService.addOrUpdateWarehouseInventory(warehouseDTO);
        }
    }

    private void processWarehouseToTruckTransfer(List<StockMovementLineDTO> lineItems) {
        for (StockMovementLineDTO item : lineItems) {
            // Get source warehouse details
            Long warehouseLocationId = inventoryLocationService
                    .getInventoryLocationByName(item.getSourceLocation()).getLocationId();

            // Get target truck details
            Long truckLocationId = inventoryLocationService
                    .getInventoryLocationByName(item.getTargetLocation()).getLocationId();

            // Get registration number from target location name
            String truckRegistrationNumber = item.getTargetLocation();

            // Get current warehouse inventory
            WarehouseInventoryDTO warehouseDTO = warehouseInventoryService
                    .getWarehouseInventoryByBatchAndLocation(item.getBatch(), warehouseLocationId);
            // Check if warehouse has sufficient quantity to transfer
            if (warehouseDTO.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient quantity in warehouse for batch " + item.getBatch());
            }

            // Create updated warehouse inventory with reduced quantity
            WarehouseInventoryDTO updatedWarehouseDTO = new WarehouseInventoryDTO();
            updatedWarehouseDTO.setBatch(item.getBatch());
            updatedWarehouseDTO.setLocation(warehouseLocationId);
            updatedWarehouseDTO.setQuantity(-item.getQuantity()); // Negative quantity for reduction
            updatedWarehouseDTO.setWarehouseLocation(warehouseDTO.getWarehouseLocation());

            warehouseInventoryService.addOrUpdateWarehouseInventory(updatedWarehouseDTO);

            // Update truck inventory (increase quantity)
            TruckInventoryDTO truckDTO = new TruckInventoryDTO();
            truckDTO.setBatch(item.getBatch());
            truckDTO.setLocation(truckLocationId);
            truckDTO.setRegistrationNumber(truckRegistrationNumber);
            truckDTO.setQuantity(item.getQuantity());

            truckInventoryService.addOrUpdateTruckInventory(truckDTO);
        }
    }

}
