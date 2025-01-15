package com.group03.backend_PharmaPulse.purchase.service;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;

import java.util.List;

public interface PurchaseGroupService {
    public List<PurchaseGroupDTO> getAllPurchaseGroups();
    public PurchaseGroupDTO getPurchaseGroupById(int id);
}
