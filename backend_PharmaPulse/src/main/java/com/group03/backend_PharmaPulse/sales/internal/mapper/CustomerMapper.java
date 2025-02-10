package com.group03.backend_PharmaPulse.sales.internal.mapper;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.internal.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "customerId",ignore = true)

    Customer toEntity(CustomerDTO customerDTO);
    CustomerDTO toDTO(Customer customer);

}
