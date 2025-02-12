package com.group03.backend_PharmaPulse.product.internal.repository;


import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface ProductRepo extends JpaRepository<Product,Long> {
}
