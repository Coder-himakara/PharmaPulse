package com.group03.backend_PharmaPulse.shared.entity;

import com.group03.backend_PharmaPulse.shared.enumeration.InvoiceStatus;
import com.group03.backend_PharmaPulse.shared.enumeration.PaymentType;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@MappedSuperclass
@Data
public abstract class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "invoice_id_seq")
    private Long invoiceId;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus invoiceStatus;

    private LocalDateTime invoiceDate;

    private String invoiceNo;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal netAmount;
}
