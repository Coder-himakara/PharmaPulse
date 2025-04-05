package com.group03.backend_PharmaPulse.inventory.internal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name="stock_movement")
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String referenceId; // Link to purchase/sale/transfer ID
    private LocalDateTime timestamp;

    @OneToMany(mappedBy = "stockMovement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockMovementLine> lineList = new ArrayList<>();
}
