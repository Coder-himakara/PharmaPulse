package com.group03.backend_PharmaPulse.purchase.service;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseLineItem;

import java.util.List;

public interface PurchaseLineItemService {
    PurchaseLineItemDTO addPurchaseLineItem(PurchaseLineItemDTO purchaseLineItemDTO);
    List<PurchaseLineItem> addPurchaseLineItems(List<PurchaseLineItem> purchaseLineItems);
}
