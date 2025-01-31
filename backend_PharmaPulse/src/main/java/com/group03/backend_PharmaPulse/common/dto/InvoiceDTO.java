package com.group03.backend_PharmaPulse.common.dto;

import com.group03.backend_PharmaPulse.common.enumeration.InvoiceStatus;
import com.group03.backend_PharmaPulse.common.enumeration.PaymentType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@SuperBuilder
public class InvoiceDTO {
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
