package com.group03.backend_PharmaPulse.purchase.internal.repository;

import com.group03.backend_PharmaPulse.purchase.internal.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface SupplierRepo extends JpaRepository<Supplier,Integer> {
}
