package com.group03.backend_PharmaPulse.sales.api.dto;


import com.group03.backend_PharmaPulse.sales.internal.entity.Customer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerGroupDTO {

    //private Long customerGroupId;

    private String customerGroupName;

    private String assignedSalesRep;

    private String descriptions;

    //private Set<Customer> customers;
}
