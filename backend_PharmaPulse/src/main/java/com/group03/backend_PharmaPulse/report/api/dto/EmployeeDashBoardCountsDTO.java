package com.group03.backend_PharmaPulse.report.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeDashBoardCountsDTO {

    private int productCount;
    private int supplierCount;
    private int customerCount;
    private int expiredStockQuantity;
//    private Long purchaseGroupCount;
//    private Long salesGroupCount;
//    private Long purchaseOrderCount;
//    private Long salesOrderCount;
//    private Long purchaseReturnCount;
//    private Long salesReturnCount;
}
