package com.group03.backend_PharmaPulse.order.api.dto;

import com.group03.backend_PharmaPulse.shared.dto.InvoiceDTO;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SalesInvoiceDTO extends InvoiceDTO {

    private Long orderId; // reference to the order
    private Long customerId; // reference to the customer
    private String customerName; // Customer details from Sales module
    private List<SalesInvoiceItemDTO> invoiceItems;

}
