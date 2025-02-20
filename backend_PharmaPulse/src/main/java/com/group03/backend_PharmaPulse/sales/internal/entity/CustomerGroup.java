package com.group03.backend_PharmaPulse.sales.internal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="customer_group")
public class CustomerGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_group_id", length = 50)

    private Long customerGroupId;

    private String customerGroupName;

    private String assignedSalesRep;

    private String descriptions;

    @OneToMany(mappedBy = "customer_group", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    //cascade  means that all cascade operations (e.g., persist, merge, remove) will be propagated from the CustomerGroup to the Customer entities.
    //For example, if a CustomerGroup is deleted, all associated Customer entities will also be deleted automatically.
    private Set<Customer> customers;
}