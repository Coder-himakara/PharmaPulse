package com.group03.backend_PharmaPulse.product.internal.repository;

import com.group03.backend_PharmaPulse.product.internal.entity.SupplierProductSequence;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface SupplierProductSequenceRepo extends JpaRepository<SupplierProductSequence, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "3000")})
    Optional<SupplierProductSequence> findById(String supplierId);
}
