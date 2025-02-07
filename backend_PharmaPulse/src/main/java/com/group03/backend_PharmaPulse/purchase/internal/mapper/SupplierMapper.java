package com.group03.backend_PharmaPulse.purchase.internal.mapper;

import com.group03.backend_PharmaPulse.purchase.api.dto.SupplierDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.purchase.internal.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    @Mapping(target = "purchase_group", source = "purchase_group.purchaseGroupId")
    SupplierDTO toDTO(Supplier supplier);

    @Mapping(target = "purchase_group", source = "purchase_group", qualifiedByName = "mapPurchaseGroup")
    @Mapping(target = "supplier_id" ,ignore = true)
    Supplier toEntity(SupplierDTO supplierDTO);

    // Map a list of Supplier entities to a list of SupplierDTOs
    List<SupplierDTO> toDTOsList(List<Supplier> suppliers);

    // Map a list of SupplierDTOs to a list of Supplier entities
    List<Supplier> toEntitiesList(List<SupplierDTO> supplierDTOs);

    // Custom method to map int to PurchaseGroup
    @Named("mapPurchaseGroup")
    default PurchaseGroup mapPurchaseGroup(Long purchaseGroupId) {
        PurchaseGroup purchaseGroup = new PurchaseGroup();
        purchaseGroup.setPurchaseGroupId(purchaseGroupId);
        return purchaseGroup;
    }

}
