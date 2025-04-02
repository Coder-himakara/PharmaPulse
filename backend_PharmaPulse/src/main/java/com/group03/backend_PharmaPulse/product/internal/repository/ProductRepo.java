package com.group03.backend_PharmaPulse.product.internal.repository;


import com.group03.backend_PharmaPulse.product.api.enumeration.ProductStatus;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface ProductRepo extends JpaRepository<Product,Long> {
    List<Product> findByProductStatus(ProductStatus productStatus);
}
