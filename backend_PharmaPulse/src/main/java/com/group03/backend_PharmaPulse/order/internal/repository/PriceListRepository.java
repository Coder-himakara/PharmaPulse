package com.group03.backend_PharmaPulse.order.internal.repository;

import com.group03.backend_PharmaPulse.order.internal.entity.PriceList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PriceListRepository extends JpaRepository<PriceList, Long> {
    Optional<PriceList> findByProductId(Long productId);
}
