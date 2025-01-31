package com.group03.backend_PharmaPulse.inventory.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "batch_inventory")
public class BatchInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long batchId;
    private String productId;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private int quantity;

}
