package com.group03.backend_PharmaPulse.product.internal.repository;


import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductWholesalePrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface ProductWholesalePriceRepo extends JpaRepository<ProductWholesalePrice, Long> {
    Optional<ProductWholesalePrice> findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(Product product);
    // New method for price history
    List<ProductWholesalePrice> findByProductOrderByEffectiveDateDesc(Product product);




}
