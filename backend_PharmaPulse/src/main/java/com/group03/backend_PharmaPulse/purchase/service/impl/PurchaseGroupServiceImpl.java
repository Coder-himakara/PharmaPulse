package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.purchase.mapper.PurchaseGroupMapper;
import com.group03.backend_PharmaPulse.purchase.repository.PurchaseGroupRepo;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseGroupServiceImpl implements PurchaseGroupService {

    private PurchaseGroupRepo purchaseGroupRepo;

    @Autowired
    private PurchaseGroupMapper purchaseGroupMapper;

    public PurchaseGroupServiceImpl(PurchaseGroupRepo purchaseGroupRepo) {
        this.purchaseGroupRepo = purchaseGroupRepo;
    }

    @Override
    public List<PurchaseGroupDTO> getAllPurchaseGroups() {
        List<PurchaseGroup> purchaseGroups= purchaseGroupRepo.findAll();
        return purchaseGroupMapper.toDTOsList(purchaseGroups);
    }

    @Override
    public PurchaseGroupDTO getPurchaseGroupById(int id) {
        return null;
    }

    @Override
    public PurchaseGroup addPurchaseGroup(PurchaseGroupDTO purchaseGroupDTO) {
        return purchaseGroupRepo.save(purchaseGroupMapper.toEntity(purchaseGroupDTO));
    }
}
