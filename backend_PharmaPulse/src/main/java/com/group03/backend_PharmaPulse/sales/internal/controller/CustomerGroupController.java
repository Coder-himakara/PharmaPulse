package com.group03.backend_PharmaPulse.sales.internal.controller;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerGroupDTO;
import com.group03.backend_PharmaPulse.sales.api.CustomerGroupService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customer-groups")
@CrossOrigin(origins = "http://localhost:3123")
public class CustomerGroupController {
    private final CustomerGroupService customerGroupService;

    public CustomerGroupController(CustomerGroupService customerGroupService) {
        this.customerGroupService = customerGroupService;
    }

    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllCustomerGroups() {
        List<CustomerGroupDTO> customerGroupDTOS = customerGroupService.getAllCustomerGroups();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", customerGroupDTOS), // 200 for retrieval
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getCustomerGroupsById(@PathVariable Long id) {
        CustomerGroupDTO selectedCustomerGroup = customerGroupService.getCustomerGroupById(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", selectedCustomerGroup), // 200 for retrieval
                HttpStatus.OK
        );
    }

    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addCustomerGroups(@Valid @RequestBody CustomerGroupDTO customerGroupDTO) {
        CustomerGroupDTO savedCustomerGroup = customerGroupService.addCustomerGroup(customerGroupDTO);
        return new ResponseEntity<>(
                new StandardResponse(201, "Success", savedCustomerGroup), // 201 for creation
                HttpStatus.CREATED
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateCustomerGroups(@Valid @PathVariable Long id,
                                                                 @RequestBody CustomerGroupDTO customerGroupDTO) {
        CustomerGroupDTO updatedCustomerGroup = customerGroupService.updateCustomerGroup(id, customerGroupDTO);
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", updatedCustomerGroup), // 200 for update
                HttpStatus.OK
        );
    }
}