package com.group03.backend_PharmaPulse.purchase.api;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseLineItem;

import java.util.List;

public interface PurchaseLineItemService {
    PurchaseLineItemDTO addPurchaseLineItem(PurchaseLineItemDTO purchaseLineItemDTO);
    List<PurchaseLineItem> addPurchaseLineItems(List<PurchaseLineItem> purchaseLineItems);
}



