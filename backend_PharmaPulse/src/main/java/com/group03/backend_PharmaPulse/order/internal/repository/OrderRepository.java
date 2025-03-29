package com.group03.backend_PharmaPulse.order.internal.repository;

import com.group03.backend_PharmaPulse.order.internal.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByOrderNumber(String orderNumber);
}
