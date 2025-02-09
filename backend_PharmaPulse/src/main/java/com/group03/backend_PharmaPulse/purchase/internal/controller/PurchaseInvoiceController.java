package com.group03.backend_PharmaPulse.purchase.internal.controller;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseInvoiceDTO;
import com.group03.backend_PharmaPulse.purchase.api.PurchaseInvoiceService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/purchase-invoices")
public class PurchaseInvoiceController {
    private final PurchaseInvoiceService purchaseInvoiceService;

    public PurchaseInvoiceController(PurchaseInvoiceService purchaseInvoiceService) {
        this.purchaseInvoiceService = purchaseInvoiceService;
    }
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllPurchaseInvoices() {
        List<PurchaseInvoiceDTO> purchaseInvoiceDTOS  = purchaseInvoiceService.getAllPurchaseInvoices();
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",purchaseInvoiceDTOS),
                HttpStatus.OK
        );
    }
    @GetMapping("/{purchaseNo}")
    public ResponseEntity<StandardResponse> getPurchaseInvoicesById(@PathVariable int purchaseNo) {
        PurchaseInvoiceDTO selectedPurchaseInvoice = purchaseInvoiceService.getPurchaseInvoicesById(purchaseNo);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",selectedPurchaseInvoice),
                HttpStatus.FOUND
        );
    }
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addPurchaseInvoice(@RequestBody PurchaseInvoiceDTO purchaseInvoiceDTO) {
        PurchaseInvoiceDTO addedPurchaseInvoice = purchaseInvoiceService.addPurchaseInvoice(purchaseInvoiceDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",addedPurchaseInvoice),
                HttpStatus.CREATED
        );
    }

}
