package com.group03.backend_PharmaPulse.sales.internal.mapper;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.sales.api.dto.CustomerGroupDTO;
import com.group03.backend_PharmaPulse.sales.internal.entity.CustomerGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerGroupMapper {
    @Mapping(target = "customerGroupId" ,ignore = true)
    @Mapping(target = "customers" ,ignore = true)
    CustomerGroup toEntity(CustomerGroupDTO customerGroupDTO);

    CustomerGroupDTO toDTO(CustomerGroup customerGroup);

    List<CustomerGroupDTO> toDTOsList(List<CustomerGroup> customerGroups);
}
