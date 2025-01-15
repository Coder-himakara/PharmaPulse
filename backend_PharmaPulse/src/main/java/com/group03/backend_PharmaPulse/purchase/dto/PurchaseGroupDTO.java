package com.group03.backend_PharmaPulse.purchase.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseGroupDTO {
    //private int purchaseGroupId;

    private String purchaseGroupName;

    private String purchaseGroupAddress;

    private String purchaseGroupContactName;

    private String purchaseGroupPhoneNo;

    private String purchaseGroupFaxNo;

    private String purchaseGroupEmail;

}
