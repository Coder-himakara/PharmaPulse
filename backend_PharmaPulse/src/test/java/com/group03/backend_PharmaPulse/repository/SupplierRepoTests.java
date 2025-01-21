package com.group03.backend_PharmaPulse.repository;

import com.group03.backend_PharmaPulse.purchase.entity.PurchaseGroup;
import com.group03.backend_PharmaPulse.purchase.entity.Supplier;
import com.group03.backend_PharmaPulse.purchase.repository.SupplierRepo;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class SupplierRepoTests {
    @Autowired
    public SupplierRepo supplierRepo;

    @Test
    public void SupplierRepo_saveAll_returnSupplier(){
        Supplier supplier= Supplier.builder()
                .supplier_id(1)
                .supplier_name("Pasindu")
                .supplier_address("Mawanella,Kegalle")
                .supplier_contactNo("0718956123")
                .supplier_email("pasin@email.com")
                .credit_limit(BigDecimal.valueOf(1235000))
                .outstanding_balance(BigDecimal.valueOf(56000))
                //.purchase_group(new PurchaseGroup().getPurchaseGroupId())
                .build();

        Supplier savedSupplier =supplierRepo.save(supplier);
        Assertions.assertThat(savedSupplier).isNotNull();
        Assertions.assertThat(savedSupplier.getSupplier_id()).isGreaterThan(0);
    }

    @Test
    public void Supplier_getAll_returnSuppliers(){

    }
}
