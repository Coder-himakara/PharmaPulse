package com.group03.backend_PharmaPulse.purchase.internal.controller;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.api.PurchaseInvoiceService;
import com.group03.backend_PharmaPulse.purchase.api.dto.response.PurchaseInvoiceResponse;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/purchase-invoices")
@PreAuthorize("hasRole('EMPLOYEE')")
public class PurchaseInvoiceController {
    private final PurchaseInvoiceService purchaseInvoiceService;

    public PurchaseInvoiceController(PurchaseInvoiceService purchaseInvoiceService) {
        this.purchaseInvoiceService = purchaseInvoiceService;
    }
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getAllPurchaseInvoices() {
        List<PurchaseInvoiceResponse> purchaseInvoiceResponses  = purchaseInvoiceService.getAllPurchaseInvoices();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",purchaseInvoiceResponses),
                HttpStatus.OK
        );
    }
    @GetMapping("/{invoiceId}")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getPurchaseInvoicesById(@PathVariable Long invoiceId) {
        PurchaseInvoiceResponse selectedPurchaseInvoice = purchaseInvoiceService.getPurchaseInvoicesById(invoiceId);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",selectedPurchaseInvoice),
                HttpStatus.OK
        );
    }
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('employee:create')")
    public ResponseEntity<StandardResponse> addPurchaseInvoice(@RequestBody PurchaseInvoiceDTO purchaseInvoiceDTO) {
        PurchaseInvoiceDTO addedPurchaseInvoice = purchaseInvoiceService.addPurchaseInvoice(purchaseInvoiceDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",addedPurchaseInvoice),
                HttpStatus.CREATED
        );
    }

}
