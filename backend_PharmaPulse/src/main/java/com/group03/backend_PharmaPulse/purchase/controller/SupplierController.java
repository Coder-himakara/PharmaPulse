package com.group03.backend_PharmaPulse.purchase.controller;

import com.group03.backend_PharmaPulse.purchase.service.SupplierService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/supplier")
public class SupplierController {
    private  SupplierService supplierService;
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }
}
