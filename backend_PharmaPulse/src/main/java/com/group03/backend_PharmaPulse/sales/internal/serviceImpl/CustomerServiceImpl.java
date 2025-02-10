package com.group03.backend_PharmaPulse.sales.internal.serviceImpl;

import com.group03.backend_PharmaPulse.sales.api.CustomerService;
import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.internal.entity.Customer;
import com.group03.backend_PharmaPulse.sales.internal.mapper.CustomerMapper;
import com.group03.backend_PharmaPulse.sales.internal.repository.CustomerRepo;
import org.springframework.stereotype.Service;


@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepo customerRepo;
    private final CustomerMapper customerMapper;
    private final CustomerService customerService;

    public CustomerServiceImpl(CustomerRepo customerRepo,
                               CustomerMapper customerMapper,
                               CustomerService customerService){
        this.customerRepo=customerRepo;
        this.customerMapper=customerMapper;
        this.customerService=customerService;
    }

   @Override
    public CustomerDTO addCustomer(CustomerDTO customerDTO){
        Customer savedCustomer =customerRepo.save(customerMapper.toEntity(customerDTO));
        return customerMapper.toDTO(savedCustomer);
   }

}

