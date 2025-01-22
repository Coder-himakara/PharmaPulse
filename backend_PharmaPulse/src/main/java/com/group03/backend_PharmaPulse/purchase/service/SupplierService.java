package com.group03.backend_PharmaPulse.purchase.service;

import com.group03.backend_PharmaPulse.purchase.dto.SupplierDTO;

import java.util.List;

public interface SupplierService {
    List<SupplierDTO> getAllSuppliers();
    SupplierDTO getSupplierById(int id);
    SupplierDTO addSupplier(SupplierDTO supplierDTO);
    SupplierDTO updateSupplier(int id,SupplierDTO supplierDTO);
}
