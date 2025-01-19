package com.group03.backend_PharmaPulse.purchase.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "purchase_group")
public class PurchaseGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_group_id",length = 50)
    private int purchaseGroupId;

    private String purchaseGroupName;

    private String purchaseGroupAddress;

    private String purchaseGroupContactName;

    private String purchaseGroupPhoneNo;

    private String purchaseGroupFaxNo;

    private String purchaseGroupEmail;

    @OneToMany(mappedBy="purchase_group")
    private Set<Supplier> suppliers;

}
