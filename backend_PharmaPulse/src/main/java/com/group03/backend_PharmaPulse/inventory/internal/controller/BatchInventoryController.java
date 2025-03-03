package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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
                new StandardResponse(200,"Success",batchInventoryDTOS),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getBatchInventoryById(@PathVariable Long id) {
        BatchInventoryDTO selectedBatchInventory = batchInventoryService.getBatchInventoryById(id);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",selectedBatchInventory),
                HttpStatus.OK
        );
    }

    @GetMapping("/expiry-alerts")
    public ResponseEntity<StandardResponse> getExpiryAlerts() {
        List<BatchInventoryDTO> expiryAlerts = batchInventoryService.checkExpiryAlerts();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", expiryAlerts),
                HttpStatus.OK
        );
    }

    @Operation(summary = "Get batches needing reorder", description = "Returns a list of BatchInventoryDTOs for batches of products requiring reorder based on total available quantity compared to reorderLimitByPackage")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation", content = @Content(mediaType = "application/json", schema = @Schema(implementation = StandardResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/reorder-alerts")
    public ResponseEntity<StandardResponse> getReorderAlerts() {
        List<BatchInventoryDTO> reorderAlerts = batchInventoryService.checkReorderAlerts();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", reorderAlerts),
                HttpStatus.OK
        );
    }
}
