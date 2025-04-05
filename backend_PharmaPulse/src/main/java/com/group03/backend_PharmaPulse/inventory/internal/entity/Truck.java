package com.group03.backend_PharmaPulse.inventory.internal.entity;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.TruckStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Truck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String registrationNumber;

    private Integer maxCapacity;

    @Enumerated(EnumType.STRING)
    private TruckStatus status;

    private LocalDate dateAdded;
    private String assignedRep;
    private Integer currentCapacity;
}
