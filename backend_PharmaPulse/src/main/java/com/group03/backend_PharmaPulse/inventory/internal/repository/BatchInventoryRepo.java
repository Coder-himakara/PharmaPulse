package com.group03.backend_PharmaPulse.inventory.internal.repository;

import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
@EnableJpaRepositories
public interface BatchInventoryRepo extends JpaRepository<BatchInventory, Long> {
    List<BatchInventory> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);
}

//findByExpiryDateBetween: Finds batches expiring within a date range (e.g., for 6-month, 3-month, 1-month, 1-week checks).