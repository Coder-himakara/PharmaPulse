package com.group03.backend_PharmaPulse.inventory.api.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpiryCountDTO {
    private int[] oneWeek;     // [Number_of_batches, available_unit_quantity]
    private int[] oneMonth;    // [Number_of_batches, available_unit_quantity]
    private int[] threeMonths; // [Number_of_batches, available_unit_quantity]
    private int[] sixMonths;   // [Number_of_batches, available_unit_quantity]
    private int[] safeBatches; // [Number_of_batches, available_unit_quantity] - beyond 6 months
}