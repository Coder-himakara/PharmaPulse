package com.group03.backend_PharmaPulse.shared.dto;

import com.group03.backend_PharmaPulse.shared.enumeration.InvoiceStatus;
import com.group03.backend_PharmaPulse.shared.enumeration.PaymentType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
public abstract class InvoiceDTO {
    //private Long invoiceId;

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
