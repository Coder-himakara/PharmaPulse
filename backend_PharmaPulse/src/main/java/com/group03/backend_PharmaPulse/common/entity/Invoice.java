package com.group03.backend_PharmaPulse.common.entity;

import com.group03.backend_PharmaPulse.common.enumeration.InvoiceStatus;
import com.group03.backend_PharmaPulse.common.enumeration.PaymentType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "invoice")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long invoiceId;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus invoiceStatus;

    private LocalDateTime invoiceDate;

    @Column(name = "invoice_no")
    private String invoiceNo;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal netAmount;

    public Invoice(InvoiceStatus invoiceStatus, LocalDateTime invoiceDate, String invoiceNo,
                   PaymentType paymentType, BigDecimal totalAmount,
                   BigDecimal discountAmount, BigDecimal netAmount) {
        this.invoiceStatus = invoiceStatus;
        this.invoiceDate = invoiceDate;
        this.invoiceNo = invoiceNo;
        this.paymentType = paymentType;
        this.totalAmount = totalAmount;
        this.discountAmount = discountAmount;
        this.netAmount = netAmount;
    }
}
