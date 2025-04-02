package com.group03.backend_PharmaPulse.sales.api.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerGroupDTO {
    private Long customerGroupId;

    private String customerGroupName;

    private String assignedSalesRep;

    private String descriptions;
}
