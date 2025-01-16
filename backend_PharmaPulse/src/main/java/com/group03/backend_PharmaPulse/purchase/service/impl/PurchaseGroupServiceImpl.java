package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.purchase.exception.PurchaseGroupNotFoundException;
import com.group03.backend_PharmaPulse.purchase.mapper.PurchaseGroupMapper;
import com.group03.backend_PharmaPulse.purchase.repository.PurchaseGroupRepo;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        if(!purchaseGroups.isEmpty()){
            return purchaseGroupMapper.toDTOsList(purchaseGroups);
        }else{
            throw new PurchaseGroupNotFoundException("No PurchaseGroups found");
        }

    }

    @Override
    public PurchaseGroupDTO getPurchaseGroupById(int id) {
        Optional<PurchaseGroup> purchaseGroup= purchaseGroupRepo.findById(id);
        return purchaseGroup.map(purchaseGroupMapper::toDTO)
                .orElseThrow(() -> new PurchaseGroupNotFoundException("PurchaseGroup not found"));
    }

    @Override
    public PurchaseGroupDTO addPurchaseGroup(PurchaseGroupDTO purchaseGroupDTO) {

        PurchaseGroup savedPurchaseGroup= purchaseGroupRepo.save(purchaseGroupMapper.toEntity(purchaseGroupDTO));
        return purchaseGroupMapper.toDTO(savedPurchaseGroup);

    }
}
