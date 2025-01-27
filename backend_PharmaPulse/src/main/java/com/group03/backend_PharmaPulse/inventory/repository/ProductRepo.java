package com.group03.backend_PharmaPulse.inventory.repository;

import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface ProductRepo extends JpaRepository<Product,String> {

    // Example of a JPQL query if more customization is needed
    @Query("SELECT p FROM Product p WHERE p.purchaseGroupId = :purchaseGroupId")
    List<Product> getProductsByPurchaseGroupId(int purchaseGroupId);
}
