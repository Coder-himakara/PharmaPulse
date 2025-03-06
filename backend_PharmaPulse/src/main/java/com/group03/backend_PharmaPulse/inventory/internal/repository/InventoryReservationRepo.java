package com.group03.backend_PharmaPulse.inventory.internal.repository;

import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryReservationRepo extends JpaRepository<InventoryReservation, Long> {
    List<InventoryReservation> findByProductId(Long productId);
    List<InventoryReservation> findByOrderId(Long orderId);
    void deleteByOrderId(Long orderId);

}
