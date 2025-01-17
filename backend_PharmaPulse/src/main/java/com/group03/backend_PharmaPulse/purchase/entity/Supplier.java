package com.group03.backend_PharmaPulse.purchase.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "supplier")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id",length = 50)
    private int supplier_id;

    private String supplier_name;

    private String supplier_address;

    private String supplier_contactNo;

    private String supplier_email;

    private BigDecimal outstanding_balance;

    private BigDecimal credit_limit;

    private Date credit_period;

    //private String purchase_group_id;

}
