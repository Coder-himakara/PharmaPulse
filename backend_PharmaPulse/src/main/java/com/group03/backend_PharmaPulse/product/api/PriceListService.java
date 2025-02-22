package com.group03.backend_PharmaPulse.product.api;

import com.group03.backend_PharmaPulse.product.api.dto.PriceListDTO;
import java.util.List;

public interface PriceListService {
    List<PriceListDTO> getAllCurrentPrices();
}