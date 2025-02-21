package com.group03.backend_PharmaPulse.inventory.api.dto;

import com.group03.backend_PharmaPulse.inventory.api.enumeration.LocationType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryLocationDTO {
    //private Long locationId;

    @Enumerated(EnumType.STRING)
    private LocationType locationType;

    private String locationName;
    private Integer totalCapacity;
    private Integer availableCapacity;
}
