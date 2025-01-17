package com.group03.backend_PharmaPulse.purchase.service.impl;

import com.group03.backend_PharmaPulse.purchase.dto.SupplierDTO;
import com.group03.backend_PharmaPulse.purchase.entity.Supplier;
import com.group03.backend_PharmaPulse.purchase.mapper.SupplierMapper;
import com.group03.backend_PharmaPulse.purchase.repository.SupplierRepo;
import com.group03.backend_PharmaPulse.purchase.service.SupplierService;
import javassist.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierServiceImpl implements SupplierService {

    private SupplierRepo supplierRepo;
    private SupplierMapper supplierMapper;

    public SupplierServiceImpl(SupplierRepo supplierRepo, SupplierMapper supplierMapper) {
        this.supplierRepo = supplierRepo;
        this.supplierMapper = supplierMapper;
    }
    @Override
    public List<SupplierDTO> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepo.findAll();
        if(!suppliers.isEmpty()) {
            return supplierMapper.toDTOsList(suppliers);
        }else {
            try {
                throw new NotFoundException("No Suppliers found");
            } catch (NotFoundException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public SupplierDTO getSupplierById(int id) {
        Optional<Supplier> supplier = supplierRepo.findById(id);
        try {
            return supplier.map(supplierMapper::toDTO)
                    .orElseThrow(() -> new NotFoundException("Supplier not found"));
        } catch (NotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public SupplierDTO addSupplier(SupplierDTO supplierDTO) {
        Supplier savedSupplier = supplierRepo.save(supplierMapper.toEntity(supplierDTO));
        return supplierMapper.toDTO(savedSupplier);
    }

    @Override
    public SupplierDTO updateSupplier(int id, SupplierDTO supplierDTO) {
        Optional<Supplier> supplier = supplierRepo.findById(id);
        if (supplier.isPresent()) {
            Supplier updatedSupplier = supplierRepo.save(supplierMapper.toEntity(supplierDTO));
            return supplierMapper.toDTO(updatedSupplier);
        } else {
            try {
                throw new NotFoundException("Supplier not found");
            } catch (NotFoundException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
