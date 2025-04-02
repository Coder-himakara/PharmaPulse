package com.group03.backend_PharmaPulse.order.internal.repository;

import com.group03.backend_PharmaPulse.order.internal.entity.SalesInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalesInvoiceRepository extends JpaRepository<SalesInvoice, Long> {
    SalesInvoice findByInvoiceNo(String invoiceNo);
    // Find the highest invoice number that starts with e.g. "1234-PP-"
    @Query("SELECT s.invoiceNo FROM SalesInvoice s WHERE s.invoiceNo LIKE CONCAT(:prefix, '%') ORDER BY s.invoiceNo DESC")
    List<String> findInvoiceNumbersByPrefix(@Param("prefix") String prefix);

    Optional<SalesInvoice> findByOrderId(Long orderId);//new


}
