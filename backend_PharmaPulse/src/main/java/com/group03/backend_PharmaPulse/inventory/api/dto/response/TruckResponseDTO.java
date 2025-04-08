package com.group03.backend_PharmaPulse.inventory.api.dto.response;

import com.group03.backend_PharmaPulse.inventory.api.enumeration.TruckStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TruckResponseDTO {
    private Long id;
    private String registrationNumber;
    private Integer maxCapacity;

    @Enumerated(EnumType.STRING)
    private TruckStatus status;

    private LocalDateTime dateAdded;
    private String assignedRep;
    private Integer currentCapacity;
}
