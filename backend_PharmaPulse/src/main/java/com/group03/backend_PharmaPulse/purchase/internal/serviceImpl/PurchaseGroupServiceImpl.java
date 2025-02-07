package com.group03.backend_PharmaPulse.purchase.internal.serviceImpl;

import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.purchase.internal.mapper.PurchaseGroupMapper;
import com.group03.backend_PharmaPulse.purchase.internal.repository.PurchaseGroupRepo;
import com.group03.backend_PharmaPulse.purchase.api.PurchaseGroupService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PurchaseGroupServiceImpl implements PurchaseGroupService {

    private final PurchaseGroupRepo purchaseGroupRepo;

    private final PurchaseGroupMapper purchaseGroupMapper;

    public PurchaseGroupServiceImpl(PurchaseGroupRepo purchaseGroupRepo,PurchaseGroupMapper purchaseGroupMapper) {
        this.purchaseGroupRepo = purchaseGroupRepo;
        this.purchaseGroupMapper = purchaseGroupMapper;
    }

    @Override
    public List<PurchaseGroupDTO> getAllPurchaseGroups() {
        List<PurchaseGroup> purchaseGroups= purchaseGroupRepo.findAll();
        if(!purchaseGroups.isEmpty()){
            return purchaseGroupMapper.toDTOsList(purchaseGroups);
        }else{
            throw new NotFoundException("No PurchaseGroups found");
        }
    }

    @Override
    public PurchaseGroupDTO getPurchaseGroupById(Long id) {
        Optional<PurchaseGroup> purchaseGroup= purchaseGroupRepo.findById(id);
        return purchaseGroup.map(purchaseGroupMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("PurchaseGroup not found"));
    }

    @Override
    public PurchaseGroupDTO addPurchaseGroup(PurchaseGroupDTO purchaseGroupDTO) {
        PurchaseGroup savedPurchaseGroup= purchaseGroupRepo.save(purchaseGroupMapper.toEntity(purchaseGroupDTO));
        return purchaseGroupMapper.toDTO(savedPurchaseGroup);
    }

    @Override
    public PurchaseGroupDTO updatePurchaseGroup(Long id, PurchaseGroupDTO purchaseGroupDTO) {
        Optional<PurchaseGroup> purchaseGroup = purchaseGroupRepo.findById(id);
        if (purchaseGroup.isPresent()) {
            PurchaseGroup updatedPurchaseGroup = purchaseGroupMapper.toEntity(purchaseGroupDTO);
            updatedPurchaseGroup.setPurchaseGroupId(id); // Ensure the ID is set to the existing entity's ID
            PurchaseGroup savedPurchaseGroup = purchaseGroupRepo.save(updatedPurchaseGroup);
            return purchaseGroupMapper.toDTO(savedPurchaseGroup);
        } else {
            throw new NotFoundException("PurchaseGroup not found");
        }
    }
}
