package com.group03.backend_PharmaPulse.sales.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;//Ensures that certain fields (name, address, contact name) cannot be empty.
import jakarta.validation.constraints.NotNull;//Ensures that the customer_group field must be provided.
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data // Automatically generates getter, setter, toString(), equals(), and hashCode() methods
@AllArgsConstructor //Creates a constructor that includes all class variables
@NoArgsConstructor //Creates a constructor with no parameters.
@Builder //Helps build objects using a simple and readable way.
//used to transfer customer-related data in a Spring Boot application
public class CustomerDTO {
    private Long customer_id;
    @NotBlank(message = "Customer Name is required")
    private String customer_name;

    @NotBlank(message = "Customer Address is required")
    private String customer_address;

    @NotBlank(message = "Customer Contact Name is required")
    private String customer_contact_name;

    @NotBlank(message = "NIC is required")
    private String customer_nic_no;

    @NotBlank(message = "BRC is required")
    private String customer_brc_no; //Business Registration Certificate (BRC) number

    @Email(message = "Invalid email format")
    private String customer_email;

    @NotNull(message = "Phone Number is required")
    private Integer customer_phone_no;

    @NotNull(message = "Please select a customer group")
    private Long customer_group;

    @NotNull(message = "Registered Date is required")
    private LocalDate registered_date;//Stores the date the customer was registered.

    @NotNull(message = "Credit Limit is required")
    private Double credit_limit;//Represents the maximum credit amount a customer can have

    @NotNull(message = "Credit Period is required")
    private Integer credit_period_in_days;//Defines the period (in days) the customer has to pay the credit.

    @NotNull(message = "Outstanding Balance is required")
    private Double outstanding_balance;//Stores the amount the customer still needs to pay

}
