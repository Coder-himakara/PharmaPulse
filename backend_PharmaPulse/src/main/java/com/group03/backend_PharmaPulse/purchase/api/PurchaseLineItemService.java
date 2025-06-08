package com.group03.backend_PharmaPulse.purchase.api;

import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseLineItem;

import java.util.List;

public interface PurchaseLineItemService {
    void addPurchaseLineItems(List<PurchaseLineItem> purchaseLineItems);
}



