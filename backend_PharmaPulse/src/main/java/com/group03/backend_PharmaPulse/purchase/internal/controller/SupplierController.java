package com.group03.backend_PharmaPulse.purchase.internal.controller;

import com.group03.backend_PharmaPulse.purchase.api.dto.SupplierDTO;
import com.group03.backend_PharmaPulse.purchase.api.SupplierService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/suppliers")
public class SupplierController {
    private final SupplierService supplierService;
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // This method is used to retrieve all suppliers
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getAllSuppliers() {
        List<SupplierDTO> supplierDTOS  = supplierService.getAllSuppliers();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",supplierDTOS),
                HttpStatus.OK
        );
    }
    // This method is used to retrieve a supplier by its id
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getSuppliersById(@PathVariable Long id) {
        SupplierDTO selectedSupplier = supplierService.getSupplierById(id);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",selectedSupplier),
                HttpStatus.OK
        );
    }
    // This method is used to add a purchase group
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('employee:create')")
    public ResponseEntity<StandardResponse> addSuppliers(@Valid
                                                             @RequestBody SupplierDTO supplierDTO) {
        SupplierDTO savedSupplier=supplierService.addSupplier(supplierDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedSupplier),
                HttpStatus.CREATED
        );
    }
    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('employee:update')")
    public ResponseEntity<StandardResponse> updateSuppliers(@Valid @PathVariable Long id,
                                                                 @RequestBody SupplierDTO supplierDTO) {
        SupplierDTO updatedSupplier=supplierService.updateSupplier(id,supplierDTO);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",updatedSupplier),
                HttpStatus.CREATED
        );
    }
}
