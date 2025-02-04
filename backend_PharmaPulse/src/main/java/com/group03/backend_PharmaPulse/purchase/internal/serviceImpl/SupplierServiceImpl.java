package com.group03.backend_PharmaPulse.purchase.internal.serviceImpl;

import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import com.group03.backend_PharmaPulse.purchase.api.dto.SupplierDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.Supplier;
import com.group03.backend_PharmaPulse.purchase.internal.mapper.SupplierMapper;
import com.group03.backend_PharmaPulse.purchase.internal.repository.SupplierRepo;
import com.group03.backend_PharmaPulse.purchase.api.SupplierService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepo supplierRepo;
    private final SupplierMapper supplierMapper;

    public SupplierServiceImpl(SupplierRepo supplierRepo, SupplierMapper supplierMapper) {
        this.supplierRepo = supplierRepo;
        this.supplierMapper = supplierMapper;
    }
    @Override
    public List<SupplierDTO> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepo.findAll();
        if(!suppliers.isEmpty()) {
            return supplierMapper.toDTOsList(suppliers);
        } else {
            throw new NotFoundException("No Suppliers found");
        }
    }

    @Override
    public SupplierDTO getSupplierById(int id) {
        Optional<Supplier> supplier = supplierRepo.findById(id);
            return supplier.map(supplierMapper::toDTO)
                    .orElseThrow(() -> new NotFoundException("Supplier not found"));

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
            Supplier updatedSupplier = supplierMapper.toEntity(supplierDTO);
            updatedSupplier.setSupplier_id(id); // Ensure the ID is set to the existing entity's ID
            Supplier savedSupplier = supplierRepo.save(updatedSupplier);
            return supplierMapper.toDTO(savedSupplier);
        } else {
            throw new NotFoundException("Supplier not found");
        }
    }
}
