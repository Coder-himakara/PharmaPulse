package com.group03.backend_PharmaPulse.inventory.api.event;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.ExpiryCountDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AlertScheduler {

    private final SimpMessagingTemplate messagingTemplate;
    private final BatchInventoryService batchInventoryService;

    public  AlertScheduler(SimpMessagingTemplate messagingTemplate, BatchInventoryService batchInventoryService) {
        this.messagingTemplate = messagingTemplate;
        this.batchInventoryService = batchInventoryService;
    }

    @Scheduled(fixedRate = 300000)
    public void pushExpiryCounts() {
        ExpiryCountDTO counts = batchInventoryService.getExpiryCounts();
        // Push the expiry counts to the expiry-counts topic
        messagingTemplate.convertAndSend("/topic/expiry-counts", counts);
    }
}

