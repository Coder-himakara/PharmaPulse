package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseLineItem;
import com.group03.backend_PharmaPulse.purchase.mapper.PurchaseLineItemMapper;
import com.group03.backend_PharmaPulse.purchase.repository.PurchaseLineItemRepo;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseLineItemService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseLineItemServiceImpl implements PurchaseLineItemService {
    private final PurchaseLineItemRepo purchaseLineItemRepo;
    private final PurchaseLineItemMapper purchaseLineItemMapper;

    public PurchaseLineItemServiceImpl(PurchaseLineItemRepo purchaseLineItemRepo,
                                       PurchaseLineItemMapper purchaseLineItemMapper) {
        this.purchaseLineItemRepo = purchaseLineItemRepo;
        this.purchaseLineItemMapper = purchaseLineItemMapper;
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
        return purchaseLineItemRepo.saveAll(purchaseLineItems);
    }
}
