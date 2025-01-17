package com.group03.backend_PharmaPulse.purchase.service;

import com.group03.backend_PharmaPulse.purchase.dto.SupplierDTO;

import java.util.List;

public interface SupplierService {
    public List<SupplierDTO> getAllSuppliers();
    public SupplierDTO getSupplierById(int id);
    public SupplierDTO addSupplier(SupplierDTO supplierDTO);
    public SupplierDTO updateSupplier(int id,SupplierDTO supplierDTO);
}
