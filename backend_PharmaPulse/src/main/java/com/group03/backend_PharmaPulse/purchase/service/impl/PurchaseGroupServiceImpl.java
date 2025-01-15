package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.purchase.repository.PurchaseGroupRepo;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseGroupService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseGroupServiceImpl implements PurchaseGroupService {

    private PurchaseGroupRepo purchaseGroupRepo;

    public PurchaseGroupServiceImpl(PurchaseGroupRepo purchaseGroupRepo) {
        this.purchaseGroupRepo = purchaseGroupRepo;
    }

    @Override
    public List<PurchaseGroup> getAllPurchaseGroups() {
        return purchaseGroupRepo.findAll();
    }

    @Override
    public PurchaseGroup getPurchaseGroupById(int id) {
        return null;
    }
}
