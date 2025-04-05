package com.group03.backend_PharmaPulse.inventory.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.TruckStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruckDTO {
    private String registrationNumber;
    private Integer maxCapacity;

    @Enumerated(EnumType.STRING)
    private TruckStatus status;

    @JsonFormat(pattern = "M/d/yyyy")
    private LocalDate dateAdded;

    private String assignedRep;
    //private Integer currentCapacity;
}
