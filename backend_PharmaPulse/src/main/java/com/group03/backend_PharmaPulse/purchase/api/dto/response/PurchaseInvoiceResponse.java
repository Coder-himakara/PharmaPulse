package com.group03.backend_PharmaPulse.purchase.api.dto.response;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.shared.enumeration.InvoiceStatus;
import com.group03.backend_PharmaPulse.shared.enumeration.PaymentType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseInvoiceResponse {
    private Long invoiceId;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus invoiceStatus;

    private LocalDateTime invoiceDate;

    private String invoiceNo;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    private Long supplierId;

    private String purchaseOrderRef;

    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal netAmount;
    private List<PurchaseLineItemDTO> lineItems;
}
