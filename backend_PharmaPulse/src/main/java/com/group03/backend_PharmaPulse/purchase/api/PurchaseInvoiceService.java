package com.group03.backend_PharmaPulse.purchase.api;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.api.dto.response.PurchaseInvoiceResponse;

import java.util.List;

public interface PurchaseInvoiceService {
    List<PurchaseInvoiceResponse> getAllPurchaseInvoices();
    PurchaseInvoiceResponse getPurchaseInvoicesById(Long invoiceId);
    PurchaseInvoiceDTO addPurchaseInvoice(PurchaseInvoiceDTO purchaseInvoiceDTO);
}
