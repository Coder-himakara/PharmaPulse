package com.group03.backend_PharmaPulse.purchase.service;

import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;

import java.util.List;

public interface PurchaseGroupService {
    public List<PurchaseGroup> getAllPurchaseGroups();
    public PurchaseGroup getPurchaseGroupById(int id);
}
