package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/batch-inventory")
public class BatchInventoryController {
    private final BatchInventoryService batchInventoryService;

    public BatchInventoryController(BatchInventoryService batchInventoryService) {
        this.batchInventoryService = batchInventoryService;
    }

    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllBatchInventories() {
        List<BatchInventoryDTO> batchInventoryDTOS  = batchInventoryService.getAllBatchInventories();
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",batchInventoryDTOS),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getBatchInventoryById(@PathVariable Long id) {
        BatchInventoryDTO selectedBatchInventory = batchInventoryService.getBatchInventoryById(id);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",selectedBatchInventory),
                HttpStatus.FOUND
        );
    }
}
