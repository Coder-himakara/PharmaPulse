package com.group03.backend_PharmaPulse.sales.internal.controller;

import com.group03.backend_PharmaPulse.sales.api.dto.CustomerDTO;
import com.group03.backend_PharmaPulse.sales.api.CustomerService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customers")
@CrossOrigin(origins = "http://localhost:3123")
@PreAuthorize("hasAnyRole('EMPLOYEE','SALES_REP')")
// Allow requests from your frontend origin
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('employee:read','sales_rep:read')")//retrieving
    public ResponseEntity<StandardResponse> getAllCustomers() {
        List<CustomerDTO> customerDTOS = customerService.getAllCustomers();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", customerDTOS),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('employee:read','sales_rep:read')")
    public ResponseEntity<StandardResponse> getCustomerById(@PathVariable Long id) {
        CustomerDTO selectedCustomer = customerService.getCustomerById(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", selectedCustomer),
                HttpStatus.FOUND
        );
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('employee:create')")
    public ResponseEntity<StandardResponse> addCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        try {
            CustomerDTO savedCustomer = customerService.addCustomer(customerDTO);
            return new ResponseEntity<>(
                    new StandardResponse(201, "Customer added successfully", savedCustomer),
                    HttpStatus.CREATED
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new StandardResponse(500, "Failed to add customer: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('employee:update')")
    public ResponseEntity<StandardResponse> updateCustomers(@Valid @PathVariable Long id,
                                                            @RequestBody CustomerDTO customerDTO) {
        try {
            CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO);
            return new ResponseEntity<>(
                    new StandardResponse(200, "Customer updated successfully", updatedCustomer),
                    HttpStatus.OK // Changed to OK for updates
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new StandardResponse(500, "Failed to update customer: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .reduce((a, b) -> a + ", " + b)
                .orElse("Validation failed");
        return new ResponseEntity<>(
                new StandardResponse(400, errorMessage, null),
                HttpStatus.BAD_REQUEST
        );
    }
}