package com.group03.backend_PharmaPulse.sales.internal.serviceImpl;

import com.group03.backend_PharmaPulse.sales.api.CustomerService;
import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.internal.entity.Customer;
import com.group03.backend_PharmaPulse.sales.internal.mapper.CustomerMapper;
import com.group03.backend_PharmaPulse.sales.internal.repository.CustomerRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


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

    /*@Override
    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerRepo.findAll();
        return customerMapper.toDTOList(customers);

    }*/

    @Override
    public CustomerDTO getCustomerById(Long id) {
        Optional<Customer> customer = customerRepo.findById(id);
        return customer.map(customerMapper::toDTO)
                .orElseThrow(()->
                        new NotFoundException("Customer not found"));
    }

    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        return null;
    }


    //new
    @Override
    public boolean existsById(Long customerId) {
        return customerRepo.existsById(customerId);
    }

    @Override
    public Customer getCustomerEntityById(Long id) {
        return customerRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with ID: " + id));
    }
}

