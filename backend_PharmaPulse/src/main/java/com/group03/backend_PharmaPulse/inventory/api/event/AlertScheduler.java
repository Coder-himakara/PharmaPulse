package com.group03.backend_PharmaPulse.inventory.api.event;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.ExpiryAlertDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertScheduler {

    private final SimpMessagingTemplate messagingTemplate;
    private final BatchInventoryService batchInventoryService;

    public  AlertScheduler(SimpMessagingTemplate messagingTemplate, BatchInventoryService batchInventoryService) {
        this.messagingTemplate = messagingTemplate;
        this.batchInventoryService = batchInventoryService;
    }

    @Scheduled(fixedRate = 300000) // 5 minutes
    public void pushExpiryAlerts() {
        List<ExpiryAlertDTO> alerts = batchInventoryService.checkExpiryAlerts();
        messagingTemplate.convertAndSend("/topic/expiry-alerts", alerts);
    }
}

