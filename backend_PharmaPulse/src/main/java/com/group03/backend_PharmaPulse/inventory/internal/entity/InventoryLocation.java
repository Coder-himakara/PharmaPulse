package com.group03.backend_PharmaPulse.inventory.internal.entity;

import com.group03.backend_PharmaPulse.inventory.api.enumeration.LocationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "inventory_location")
public class InventoryLocation { // This class is used to store the location of the inventory
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id",length = 50)
    private Long locationId;

    @Enumerated(EnumType.STRING)
    private LocationType locationType;

    private String locationName;
    private Integer totalCapacity;
    private Integer availableCapacity;

    @OneToMany(mappedBy="location",fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Inventory> inventories;
}
