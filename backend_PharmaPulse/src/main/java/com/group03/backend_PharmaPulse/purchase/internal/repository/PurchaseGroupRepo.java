package com.group03.backend_PharmaPulse.purchase.internal.repository;

import com.group03.backend_PharmaPulse.purchase.internal.entity.PurchaseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;


@Repository
@EnableJpaRepositories
public interface PurchaseGroupRepo extends JpaRepository<PurchaseGroup,Long> {

}
