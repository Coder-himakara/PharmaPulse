package com.group03.backend_PharmaPulse.inventory.internal.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@PrimaryKeyJoinColumn(name = "inventory_id")
public class WarehouseInventory extends Inventory{
    private String warehouseLocation;
}
