package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseInvoice;
import com.group03.backend_PharmaPulse.purchase.mapper.PurchaseInvoiceMapper;
import com.group03.backend_PharmaPulse.purchase.repository.PurchaseInvoiceRepo;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseInvoiceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PurchaseInvoiceImpl implements PurchaseInvoiceService {

    private PurchaseInvoiceRepo purchaseInvoiceRepo;
    private PurchaseInvoiceMapper purchaseInvoiceMapper;

    public PurchaseInvoiceImpl(PurchaseInvoiceRepo purchaseInvoiceRepo, PurchaseInvoiceMapper purchaseInvoiceMapper) {
        this.purchaseInvoiceRepo = purchaseInvoiceRepo;
        this.purchaseInvoiceMapper = purchaseInvoiceMapper;
    }

    @Override
    public List<PurchaseInvoiceDTO> getAllPurchaseInvoices() {
        return null;
    }

    @Override
    public PurchaseInvoiceDTO getPurchaseInvoicesById(int purchaseNo) {
        return null;
    }

    @Override
    @Transactional
    public PurchaseInvoiceDTO addPurchaseInvoice(PurchaseInvoiceDTO purchaseInvoiceDTO) {
        PurchaseInvoice savedPurchaseInvoice = purchaseInvoiceRepo.save(purchaseInvoiceMapper.
                toEntity(purchaseInvoiceDTO));

        return purchaseInvoiceMapper.toDTO(savedPurchaseInvoice);
    }
}
