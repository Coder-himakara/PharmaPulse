package com.group03.backend_PharmaPulse.purchase.api.dto;


import com.group03.backend_PharmaPulse.shared.dto.InvoiceDTO;
import lombok.*;


import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PurchaseInvoiceDTO extends InvoiceDTO {

    private Long supplierId;
    private String purchaseOrderRef;
    private List<PurchaseLineItemDTO> lineItemsList;
}
