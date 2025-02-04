package com.group03.backend_PharmaPulse.purchase.api;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseInvoiceDTO;

import java.util.List;

public interface PurchaseInvoiceService {
    List<PurchaseInvoiceDTO> getAllPurchaseInvoices();
    PurchaseInvoiceDTO getPurchaseInvoicesById(int purchaseNo);
    PurchaseInvoiceDTO addPurchaseInvoice(PurchaseInvoiceDTO purchaseInvoiceDTO);
}
