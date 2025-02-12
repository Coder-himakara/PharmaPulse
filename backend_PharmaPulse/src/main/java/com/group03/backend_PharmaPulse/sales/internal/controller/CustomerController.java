package com.group03.backend_PharmaPulse.sales.internal.controller;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.api.event.CustomerService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/customers")
public class CustomerController {
    private final CustomerService customerService;
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;

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

}
