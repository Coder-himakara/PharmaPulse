package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.StockTransferService;
import com.group03.backend_PharmaPulse.inventory.api.dto.StockMovementDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/stock-transfer")
@PreAuthorize("hasRole('EMPLOYEE')")
public class StockTransferController {
    private final StockTransferService stockTransferService;

    public StockTransferController(StockTransferService stockTransferService) {
        this.stockTransferService = stockTransferService;
    }

    @PostMapping("/process")
    @PreAuthorize("hasAuthority('employee:create')")
    public ResponseEntity<StandardResponse> processStockTransfer(StockMovementDTO stockMovementDTO) {
        try {
            StockMovementDTO processedTransfer = stockTransferService.processStockTransfer(stockMovementDTO);
            return new ResponseEntity<>(
                    new StandardResponse(201,"Success",processedTransfer),
                    HttpStatus.CREATED
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new StandardResponse(400, "Error", e.getMessage()));
        }
    }
}
