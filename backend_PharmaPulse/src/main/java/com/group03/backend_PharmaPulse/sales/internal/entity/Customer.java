package com.group03.backend_PharmaPulse.sales.internal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;

@Entity //Marks this class as a JPA entity (maps it to a database table).
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Uses auto-increment in the database.
    @Column(name = "customer_id",length = 50)
    private Long customer_id;

    private String customer_name;
    private String customer_address;
    private String customer_contact_name;
    private String customer_nic_no;
    private String customer_brc_no;
    private String customer_email;
    private String customer_phone_no;

    private LocalDate registered_date;

    private Double credit_limit;
    private Integer credit_period_in_days;
    private Double outstanding_balance;

    @ManyToOne
    @JoinColumn(name="customer_group_id",nullable=false)//Maps customer_group_id as a foreign key in the customer table.
    private CustomerGroup customer_group;


}
