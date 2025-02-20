package com.group03.backend_PharmaPulse.inventory.internal.entity;

import com.group03.backend_PharmaPulse.inventory.api.enumeration.TruckStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Truck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Auto-generated ID

    @Column(unique = true, nullable = false)
    private String truckId;

    @Column(unique = true, nullable = false)
    private String registrationNumber;

    private double maxCapacity;

    @Enumerated(EnumType.STRING)
    private TruckStatus status;

    private LocalDateTime dateAdded = LocalDateTime.now();
    private String assignedReplId;
    private double currentCapacity;

    public double checkAvailableSpace() {
        return maxCapacity - currentCapacity;
    }
}
