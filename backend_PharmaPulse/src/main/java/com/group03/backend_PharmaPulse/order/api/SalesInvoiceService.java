package com.group03.backend_PharmaPulse.order.api;

import com.group03.backend_PharmaPulse.order.api.dto.SalesInvoiceDTO;
import java.util.List;

public interface SalesInvoiceService {
    SalesInvoiceDTO createSalesInvoice(SalesInvoiceDTO salesInvoiceDTO);
    SalesInvoiceDTO getSalesInvoiceById(Long invoiceId);
    List<SalesInvoiceDTO> getAllSalesInvoices();
}
