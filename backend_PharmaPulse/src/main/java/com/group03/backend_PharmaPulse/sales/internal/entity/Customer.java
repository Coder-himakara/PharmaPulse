package com.group03.backend_PharmaPulse.sales.internal.entity;

import com.group03.backend_PharmaPulse.sales.api.enumeration.CustomerStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
