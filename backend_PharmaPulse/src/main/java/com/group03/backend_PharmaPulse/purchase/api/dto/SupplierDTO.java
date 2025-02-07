package com.group03.backend_PharmaPulse.purchase.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierDTO {

    //private int supplier_id;

    @NotBlank(message = "Supplier Name is required")
    private String supplier_name;

    @NotBlank(message = "Supplier Address is required")
    private String supplier_address;

    @NotBlank(message = "Supplier Contact Number is required")
    private String supplier_contactNo;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String supplier_email;

    private BigDecimal outstanding_balance;

    private BigDecimal credit_limit;

    private Integer credit_period;

    @NotNull(message = "Please select a purchase group")
    private Long purchase_group;
}
