package com.group03.backend_PharmaPulse.inventory.api.dto;

import com.group03.backend_PharmaPulse.inventory.api.enumeration.TruckStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruckDTO {
    private String truckId;
    private String registrationNumber;
    private double maxCapacity;
    @Enumerated(EnumType.STRING)
    private TruckStatus status;
    private LocalDateTime dateAdded = LocalDateTime.now();
    private String assignedReplId;
    private double currentCapacity;
}
