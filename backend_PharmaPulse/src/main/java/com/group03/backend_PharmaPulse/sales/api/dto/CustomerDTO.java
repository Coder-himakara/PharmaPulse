package com.group03.backend_PharmaPulse.sales.api.dto;
import com.group03.backend_PharmaPulse.sales.api.enumeration.CustomerStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

public class CustomerDTO {
    private Long customerId;

    private String customerName;
    private String customerAddress;
    private String customerContactName;
    private String customerNicNo;
    private String customerBrcNo;
    private String customerEmail;
    private Integer customerPhoneNo;
    private String customerGroup;

    private LocalDate registeredDate;

    private Double creditLimit;
    private Integer creditPeriodInDays; // Changed for consistency with days as integer
    private Double outstandingBalance;

    @Enumerated(EnumType.STRING)
    private CustomerStatus customerStatus;



}
