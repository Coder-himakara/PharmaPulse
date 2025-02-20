package com.group03.backend_PharmaPulse.sales.internal.mapper;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerGroupDTO;
import com.group03.backend_PharmaPulse.sales.internal.entity.CustomerGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
// used for mapping between the CustomerGroupDTO and CustomerGroup entities.
@Mapper(componentModel = "spring")
public interface CustomerGroupMapper {
    @Mapping(target = "customerGroupId" ,ignore = true)
    //Ignores the customerGroupId field when converting. This could be because customerGroupId is auto-generated (e.g., a primary key that doesn’t need to be set manually).
    @Mapping(target = "customers" ,ignore = true)
    CustomerGroup toEntity(CustomerGroupDTO customerGroupDTO);

    CustomerGroupDTO toDTO(CustomerGroup customerGroup);

    List<CustomerGroupDTO> toDTOsList(List<CustomerGroup> customerGroups);
}
