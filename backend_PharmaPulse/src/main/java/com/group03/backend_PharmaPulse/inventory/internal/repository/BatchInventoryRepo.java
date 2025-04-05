package com.group03.backend_PharmaPulse.inventory.internal.repository;

import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.BatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface BatchInventoryRepo extends JpaRepository<BatchInventory, Long> {

    //findByExpiryDateBetween: Finds batches expiring within a date range (e.g., for 6-month, 3-month, 1-month, 1-week checks).
    List<BatchInventory> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);

    //findByProductIdAndStatus: Retrieves all BatchInventory records for a specific productId with a given batchStatus (e.g., AVAILABLE).
    @Query("SELECT b FROM BatchInventory b WHERE b.productId = :productId AND b.batchStatus = :status")
    List<BatchInventory> findByProductIdAndStatus(Long productId, BatchStatus status);

    //sumAvailableUnitQuantityByProductIdAndStatus: Calculates the total availableUnitQuantity for all batches of a product with a specific batchStatus.
    @Query("SELECT SUM(b.availableUnitQuantity) FROM BatchInventory b WHERE b.productId = :productId AND b.batchStatus = :status")
    Integer sumAvailableUnitQuantityByProductIdAndStatus(Long productId, BatchStatus status);

    List<BatchInventory> findByProductId(Long productId);

    @Query("SELECT DISTINCT b.productId FROM BatchInventory b")
    List<Long> findDistinctProductIds();

    List<BatchInventory> findByExpiryDateBeforeAndBatchStatusNot(LocalDate date, BatchStatus status);

    List<BatchInventory> findByBatchStatus(BatchStatus batchStatus);
}