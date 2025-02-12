package com.group03.backend_PharmaPulse.sales.api.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerGroupDTO {

    @NotBlank(message = "Customer Group Name is required")
    private String customer_group_name;

    @NotBlank(message = "Assign Sales Rep is required")
    private String assigned_sales_rep;

    private String descriptions;

    //customer Id List Should Include
}
