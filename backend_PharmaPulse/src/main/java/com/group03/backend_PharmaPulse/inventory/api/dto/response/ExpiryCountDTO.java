package com.group03.backend_PharmaPulse.inventory.api.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpiryCountDTO {
    private int oneWeek;
    private int oneMonth;
    private int threeMonths;
    private int sixMonths;
}