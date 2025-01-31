package com.group03.backend_PharmaPulse.purchase.dto;


import com.group03.backend_PharmaPulse.common.dto.InvoiceDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;


@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class PurchaseInvoiceDTO extends InvoiceDTO {

    private Integer purchaseNo;
    private String supplierId;
    private String purchaseOrderRef;
    private List<PurchaseLineItemDTO> lineItemsList;
}
