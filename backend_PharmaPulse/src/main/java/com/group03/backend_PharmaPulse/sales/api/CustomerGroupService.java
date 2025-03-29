package com.group03.backend_PharmaPulse.sales.api;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerGroupDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface CustomerGroupService {
    CustomerGroupDTO addCustomerGroup(CustomerGroupDTO customerGroupDTO);

    List<CustomerGroupDTO> getAllCustomerGroups();

    CustomerGroupDTO getCustomerGroupById(Long id);

    CustomerGroupDTO updateCustomerGroup(@Valid Long id, CustomerGroupDTO customerGroupDTO);
}
