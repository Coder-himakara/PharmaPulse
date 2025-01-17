package com.group03.backend_PharmaPulse.purchase.controller;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.dto.SupplierDTO;
import com.group03.backend_PharmaPulse.purchase.service.SupplierService;
import com.group03.backend_PharmaPulse.util.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supplier")
public class SupplierController {
    private  SupplierService supplierService;
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // This method is used to retrieve all suppliers
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllSuppliers() {
        List<SupplierDTO> supplierDTOS  = supplierService.getAllSuppliers();
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Success",supplierDTOS),
                HttpStatus.OK
        );
    }
    // This method is used to retrieve a supplier by its id
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getSuppliersById(@PathVariable int id) {
        SupplierDTO selectedSupplier = supplierService.getSupplierById(id);
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Success",selectedSupplier),
                HttpStatus.FOUND
        );
    }
    // This method is used to add a purchase group
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addSuppliers(@Valid
                                                             @RequestBody SupplierDTO supplierDTO) {
        SupplierDTO savedSupplier=supplierService.addSupplier(supplierDTO);
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Success",savedSupplier),
                HttpStatus.CREATED
        );
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateSuppliers(@PathVariable int id,
                                                                 @RequestBody SupplierDTO supplierDTO) {
        SupplierDTO updatedSupplier=supplierService.updateSupplier(id,supplierDTO);
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Success",updatedSupplier),
                HttpStatus.CREATED
        );

    }
}
