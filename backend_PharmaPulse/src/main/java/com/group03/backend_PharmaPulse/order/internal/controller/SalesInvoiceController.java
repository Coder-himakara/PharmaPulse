package com.group03.backend_PharmaPulse.order.internal.controller;

import com.group03.backend_PharmaPulse.order.api.SalesInvoiceService;
import com.group03.backend_PharmaPulse.order.api.dto.SalesInvoiceDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sales-invoices")
public class SalesInvoiceController {

    private final SalesInvoiceService salesInvoiceService;

    public SalesInvoiceController(SalesInvoiceService salesInvoiceService) {
        this.salesInvoiceService = salesInvoiceService;
    }

    @PostMapping
    public ResponseEntity<SalesInvoiceDTO> createSalesInvoice(@RequestBody SalesInvoiceDTO salesInvoiceDTO) {
        SalesInvoiceDTO createdInvoice = salesInvoiceService.createSalesInvoice(salesInvoiceDTO);
        return ResponseEntity.ok(createdInvoice);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesInvoiceDTO> getSalesInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(salesInvoiceService.getSalesInvoiceById(id));
    }

    @GetMapping
    public ResponseEntity<List<SalesInvoiceDTO>> getAllSalesInvoices() {
        return ResponseEntity.ok(salesInvoiceService.getAllSalesInvoices());
    }
}
