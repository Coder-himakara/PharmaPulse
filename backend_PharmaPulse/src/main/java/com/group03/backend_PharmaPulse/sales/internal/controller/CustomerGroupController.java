package com.group03.backend_PharmaPulse.sales.internal.controller;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerGroupDTO;
import com.group03.backend_PharmaPulse.sales.api.event.CustomerGroupService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/customer-groups")
public class CustomerGroupController {
    private final CustomerGroupService customerGroupService;
    public CustomerGroupController(CustomerGroupService customerGroupService) {
        this.customerGroupService = customerGroupService;
    }
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addCustomerGroups(@Valid
                                                              @RequestBody CustomerGroupDTO customerGroupDTO) {
        CustomerGroupDTO savedCustomerGroup=customerGroupService.addCustomerGroup(customerGroupDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success", savedCustomerGroup),
                HttpStatus.CREATED
        );
    }
}
