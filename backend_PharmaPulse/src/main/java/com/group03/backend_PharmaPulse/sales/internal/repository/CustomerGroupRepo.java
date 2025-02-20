package com.group03.backend_PharmaPulse.sales.internal.repository;

import com.group03.backend_PharmaPulse.sales.internal.entity.CustomerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository //Marks this interface as a Spring-managed repository
@EnableJpaRepositories //Enables Spring Data JPA repositories.
public interface CustomerGroupRepo extends JpaRepository<CustomerGroup, Integer> {
    //This makes CustomerGroupRepo inherit built-in CRUD methods from JpaRepository, such as:
    //
    //    save(CustomerGroup entity) → Saves or updates a customer group.
    //    findById(Integer id) → Finds a customer group by its ID.
    //    findAll() → Gets all customer groups.
    //    deleteById(Integer id) → Deletes a customer group by ID.
}
