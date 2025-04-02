package com.group03.backend_PharmaPulse.inventory.api.event;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.ExpiryCountDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.StockCountDTO;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AlertScheduler {

    private final SimpMessagingTemplate messagingTemplate;
    private final BatchInventoryService batchInventoryService;
    private boolean applicationReady = false;

    public AlertScheduler(SimpMessagingTemplate messagingTemplate, BatchInventoryService batchInventoryService) {
        this.messagingTemplate = messagingTemplate;
        this.batchInventoryService = batchInventoryService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        applicationReady = true;
        log.info("Application ready, alert scheduler can now run");
    }

    @Scheduled(fixedRate = 420000)
    public void pushAllAlerts() {
        if (!applicationReady) {
            log.debug("Application not fully initialized, skipping alert push");
            return;
        }

        try {
            ExpiryCountDTO counts = batchInventoryService.getExpiryCounts();
            StockCountDTO stocks = batchInventoryService.stockAvailability();
            messagingTemplate.convertAndSend("/topic/expiry-counts", counts);
            messagingTemplate.convertAndSend("/topic/stock-counts", stocks);
        } catch (NotFoundException e) {
            log.info("No product batches available for alerts yet");
        }
    }
}