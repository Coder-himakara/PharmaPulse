package com.group03.backend_PharmaPulse.sales.internal.serviceImpl;

import com.group03.backend_PharmaPulse.sales.api.event.CustomerService;
import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.internal.entity.Customer;
import com.group03.backend_PharmaPulse.sales.internal.mapper.CustomerMapper;
import com.group03.backend_PharmaPulse.sales.internal.repository.CustomerRepo;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepo customerRepo;
    private final CustomerMapper customerMapper;

    public CustomerServiceImpl(CustomerRepo customerRepo,
                               CustomerMapper customerMapper){
        this.customerRepo=customerRepo;
        this.customerMapper=customerMapper;

    }

   @Override
    public CustomerDTO addCustomer(CustomerDTO customerDTO){
        Customer savedCustomer =customerRepo.save(customerMapper.toEntity(customerDTO));
        return customerMapper.toDTO(savedCustomer);
   }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return List.of();
    }

    @Override
    public CustomerDTO getCustomerById(Long id) {
        return null;
    }

    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        return null;
    }

}

