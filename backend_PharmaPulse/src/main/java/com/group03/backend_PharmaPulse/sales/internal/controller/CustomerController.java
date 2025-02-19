package com.group03.backend_PharmaPulse.sales.internal.controller;

import com.group03.backend_PharmaPulse.purchase.api.dto.SupplierDTO;
import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.api.event.CustomerService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customers")
public class CustomerController {
    private final CustomerService customerService;
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;

    }
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllCustomers() {
        List<CustomerDTO> customerDTOS  = customerService.getAllCustomers();
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",customerDTOS),
                HttpStatus.OK
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getSuppliersById(@PathVariable Long id) {
        CustomerDTO selectedCustomer = customerService.getCustomerById(id);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",selectedCustomer),
                HttpStatus.FOUND
        );
    }
    // This method is used to add a customer group
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addCustomer(@Valid
                                                         @RequestBody CustomerDTO customerDTO) {
        CustomerDTO savedCustomer=customerService.addCustomer(customerDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedCustomer),
                HttpStatus.CREATED
        );
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateCustomers(@Valid @PathVariable Long id,
                                                            @RequestBody CustomerDTO customerDTO) {
        CustomerDTO updatedCustomer=customerService.updateCustomer(id,customerDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",updatedCustomer),
                HttpStatus.CREATED
        );
    }


}
