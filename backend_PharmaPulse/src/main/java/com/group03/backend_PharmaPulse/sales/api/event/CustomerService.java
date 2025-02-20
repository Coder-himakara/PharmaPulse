package com.group03.backend_PharmaPulse.sales.api.event;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import jakarta.validation.Valid;

import java.util.List;


public interface CustomerService {

    CustomerDTO addCustomer(CustomerDTO customerDTO);

    List<CustomerDTO> getAllCustomers();

    CustomerDTO getCustomerById(Long id);

    CustomerDTO updateCustomer(@Valid Long id, CustomerDTO customerDTO);
}
