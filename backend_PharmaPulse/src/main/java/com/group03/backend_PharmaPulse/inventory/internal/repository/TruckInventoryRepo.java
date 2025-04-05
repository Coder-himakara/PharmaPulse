package com.group03.backend_PharmaPulse.inventory.internal.repository;

import com.group03.backend_PharmaPulse.inventory.internal.entity.TruckInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface TruckInventoryRepo extends JpaRepository<TruckInventory, Long> {

    @Query("SELECT ti FROM TruckInventory ti WHERE ti.batch.batchId = :batchId AND ti.location.locationId = :locationId")
    Optional<TruckInventory> findByBatchIdAndLocationId(@Param("batchId") Long batchId,
                                                        @Param("locationId") Long locationId);
}
