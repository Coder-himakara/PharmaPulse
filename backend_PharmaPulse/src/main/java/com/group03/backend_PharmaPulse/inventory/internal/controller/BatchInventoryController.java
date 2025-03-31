package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ExpiryAlertDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ReorderAlertDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.ExpiryCountDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/batch-inventory")
@PreAuthorize("hasRole('EMPLOYEE')")
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

//    @MessageMapping("/expiry-alerts")
//    @SendTo("/topic/expiry-alerts")
    @GetMapping("/expiry-alerts")
    public ResponseEntity<StandardResponse> getExpiryAlerts() {
        List<ExpiryAlertDTO> expiryAlerts = batchInventoryService.checkExpiryAlerts();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", expiryAlerts),
                HttpStatus.OK
        );
    }

    @GetMapping("/reorder-alerts")
    public ResponseEntity<StandardResponse> getReorderAlerts() {
        List<ReorderAlertDTO> reorderAlerts = batchInventoryService.checkReorderAlerts();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", reorderAlerts),
                HttpStatus.OK
        );
    }

    @GetMapping("/expiry-counts")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getExpiryCounts() {
        ExpiryCountDTO counts = batchInventoryService.getExpiryCounts();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", counts),
                HttpStatus.OK
        );
    }

   // WebSocket endpoint
   @MessageMapping("/expiry-counts")
   @SendTo("/topic/expiry-counts")
   public ExpiryCountDTO getExpiryCountsWs() {
       return batchInventoryService.getExpiryCounts();
   }
}
