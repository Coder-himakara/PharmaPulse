package com.group03.backend_PharmaPulse.sales.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDTO {

    @NotBlank(message = "Customer Name is required")
    private String customer_name;

    @NotBlank(message = "Customer Address is required")
    private String customer_address;

    @NotBlank(message = "Customer Contact Name is required")
    private String customer_contact_name;

    private String customer_nic_no;

    private String customer_brc_no;

    private String customer_email;

    private Integer customer_phone_no;

    @NotNull(message = "Please select a customer group")
    private String customer_group;

    private LocalDate registered_date;

    private Double credit_limit;

    private Integer credit_period_in_days;

    private Double outstanding_balance;





}
