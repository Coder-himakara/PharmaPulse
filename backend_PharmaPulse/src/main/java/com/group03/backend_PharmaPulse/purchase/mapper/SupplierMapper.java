package com.group03.backend_PharmaPulse.purchase.mapper;

import com.group03.backend_PharmaPulse.purchase.dto.SupplierDTO;
import com.group03.backend_PharmaPulse.purchase.entity.Supplier;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    Supplier toEntity(SupplierDTO supplierDTO);
    SupplierDTO toDTO(Supplier supplier);
    List<SupplierDTO> toDTOsList(List<Supplier> suppliers);
}
