package com.group03.backend_PharmaPulse.purchase.api;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseGroupDTO;

import java.util.List;

public interface PurchaseGroupService {
     List<PurchaseGroupDTO> getAllPurchaseGroups();
     PurchaseGroupDTO getPurchaseGroupById(int id);

     PurchaseGroupDTO addPurchaseGroup(PurchaseGroupDTO purchaseGroupDTO);

     PurchaseGroupDTO updatePurchaseGroup(int id,PurchaseGroupDTO purchaseGroupDTO);
}
