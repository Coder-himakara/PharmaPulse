package com.group03.backend_PharmaPulse.purchase.service;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;

import java.util.List;

public interface PurchaseGroupService {
     List<PurchaseGroupDTO> getAllPurchaseGroups();
     PurchaseGroupDTO getPurchaseGroupById(int id);

     PurchaseGroupDTO addPurchaseGroup(PurchaseGroupDTO purchaseGroupDTO);

     PurchaseGroupDTO updatePurchaseGroup(int id,PurchaseGroupDTO purchaseGroupDTO);
}
