package com.group03.backend_PharmaPulse.sales.internal.mapper;


import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.internal.entity.Customer;
import com.group03.backend_PharmaPulse.sales.internal.entity.CustomerGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "customer_group", source = "customer_group.customerGroupId")
    CustomerDTO toDTO(Customer customer);

    @Mapping(target = "customer_group", source = "customer_group", qualifiedByName = "mapCustomerGroup")
    @Mapping(target = "customer_id" ,ignore = true)
    Customer toEntity(CustomerDTO customerDTO);

    //new


    // Map a list of Customer entities to a list of CustomerDTOs
    List<CustomerDTO> toDTOList(List<Customer> customers);

    // Map a list of CustomerDTOs to a list of Customer entities
    List<Customer> toEntitiesList(List<CustomerDTO> customerDTOs);

    // Custom method to map int to CustomerGroup
    @Named("mapCustomerGroup") //assign a custom method in the CustomerMapper interface for handling a specific mapping.
    default CustomerGroup mapCustomerGroup(Long customerGroupId) {
        CustomerGroup customerGroup = new CustomerGroup();
        customerGroup.setCustomerGroupId(customerGroupId);
        return customerGroup;
    }


}
