package com.group03.backend_PharmaPulse.inventory.internal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name="stock_movement_line")
public class StockMovementLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name ="batch_id", nullable = false)
    private BatchInventory batch;

    private Integer quantity;
    private String sourceLocation; // Warehouse/Truck ID
    private String targetLocation; // Warehouse/Truck ID

    @ManyToOne
    @JoinColumn(name = "stock_movement_id")
    private StockMovement stockMovement; // Proper entity relationship
}
