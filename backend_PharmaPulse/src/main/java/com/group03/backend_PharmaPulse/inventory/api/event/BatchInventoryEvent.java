package com.group03.backend_PharmaPulse.inventory.api.event;

import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import org.springframework.context.ApplicationEvent;

import java.util.List;

public class BatchInventoryEvent extends ApplicationEvent {
    private final List<BatchInventory> createdBatches;

    public BatchInventoryEvent(Object source, List<BatchInventory> createdBatches) {
        super(source);
        this.createdBatches = createdBatches;
    }

    public List<BatchInventory> getCreatedBatches() {
        return createdBatches;
    }
}