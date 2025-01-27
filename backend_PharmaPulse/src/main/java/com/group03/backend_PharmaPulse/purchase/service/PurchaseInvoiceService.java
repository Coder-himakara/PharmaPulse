package com.group03.backend_PharmaPulse.purchase.service;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseInvoiceDTO;

import java.util.List;

public interface PurchaseInvoiceService {
    List<PurchaseInvoiceDTO> getAllPurchaseInvoices();
    PurchaseInvoiceDTO getPurchaseInvoicesById(int purchaseNo);
    PurchaseInvoiceDTO addPurchaseInvoice(PurchaseInvoiceDTO purchaseInvoiceDTO);
}
