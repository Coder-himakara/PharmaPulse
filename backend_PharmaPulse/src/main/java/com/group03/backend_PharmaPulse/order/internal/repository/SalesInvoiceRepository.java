package com.group03.backend_PharmaPulse.order.internal.repository;

import com.group03.backend_PharmaPulse.order.internal.entity.SalesInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesInvoiceRepository extends JpaRepository<SalesInvoice, Long> {
    SalesInvoice findByInvoiceNumber(String invoiceNumber);
}
