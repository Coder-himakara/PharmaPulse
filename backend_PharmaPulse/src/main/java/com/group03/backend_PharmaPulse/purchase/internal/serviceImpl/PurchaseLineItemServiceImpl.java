package com.group03.backend_PharmaPulse.purchase.internal.serviceImpl;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseLineItem;
import com.group03.backend_PharmaPulse.purchase.api.event.PurchaseLineItemEvent;
import com.group03.backend_PharmaPulse.purchase.internal.mapper.PurchaseLineItemMapper;
import com.group03.backend_PharmaPulse.purchase.internal.repository.PurchaseLineItemRepo;
import com.group03.backend_PharmaPulse.purchase.api.PurchaseLineItemService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseLineItemServiceImpl implements PurchaseLineItemService {
    private final PurchaseLineItemRepo purchaseLineItemRepo;
    private final PurchaseLineItemMapper purchaseLineItemMapper;
    private final ApplicationEventPublisher eventPublisher;

    public PurchaseLineItemServiceImpl(PurchaseLineItemRepo purchaseLineItemRepo,
                                       PurchaseLineItemMapper purchaseLineItemMapper,
                                       ApplicationEventPublisher eventPublisher) {
        this.purchaseLineItemRepo = purchaseLineItemRepo;
        this.purchaseLineItemMapper = purchaseLineItemMapper;
        this.eventPublisher=eventPublisher;
    }

    @Override
    public PurchaseLineItemDTO addPurchaseLineItem(PurchaseLineItemDTO purchaseLineItemDTO) {
        PurchaseLineItem savedPurchaseLineItem = purchaseLineItemRepo.save(purchaseLineItemMapper.
                toEntity(purchaseLineItemDTO));
        return purchaseLineItemMapper.toDTO(savedPurchaseLineItem);
    }
    // Add a list of line items when adding purchase invoice to the database
    @Override
    public List<PurchaseLineItem> addPurchaseLineItems(List<PurchaseLineItem> purchaseLineItems) {
        List<PurchaseLineItem> savedItems =purchaseLineItemRepo.saveAll(purchaseLineItems);
        List<PurchaseLineItemDTO> savedDTOs =purchaseLineItemMapper.toDTOsList(savedItems);
        //Publish the event
        eventPublisher.publishEvent(new PurchaseLineItemEvent(this,savedDTOs));
        return savedItems;
    }
}
