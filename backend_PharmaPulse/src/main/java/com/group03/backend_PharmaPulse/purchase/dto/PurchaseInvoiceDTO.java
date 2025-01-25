package com.group03.backend_PharmaPulse.purchase.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PurchaseInvoiceDTO {

    private Integer purchaseNo;
    private String supplierId;
    private String purchaseOrderRef;

}
