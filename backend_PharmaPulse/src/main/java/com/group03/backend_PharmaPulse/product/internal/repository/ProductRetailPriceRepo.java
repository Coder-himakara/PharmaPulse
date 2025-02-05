package com.group03.backend_PharmaPulse.product.internal.repository;


import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductRetailPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface ProductRetailPriceRepo extends JpaRepository<ProductRetailPrice, Long> {
    Optional<ProductRetailPrice> findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(Product product);
}
