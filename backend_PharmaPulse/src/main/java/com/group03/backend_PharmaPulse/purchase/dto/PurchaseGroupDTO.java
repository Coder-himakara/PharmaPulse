package com.group03.backend_PharmaPulse.purchase.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseGroupDTO {
    private int purchaseGroupId;

    @NotBlank(message = "Purchase Group Name is required")
    private String purchaseGroupName;

    @NotBlank(message = "Purchase Group Address is required")
    private String purchaseGroupAddress;

    @NotBlank(message = "Purchase Group Contact Name is required")
    private String purchaseGroupContactName;

    @NotBlank(message = "Purchase Group Phone Number is required")
    private String purchaseGroupPhoneNo;

    private String purchaseGroupFaxNo;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String purchaseGroupEmail;

}
