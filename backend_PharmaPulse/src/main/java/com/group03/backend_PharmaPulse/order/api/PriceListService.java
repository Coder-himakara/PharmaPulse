package com.group03.backend_PharmaPulse.order.api;

import com.group03.backend_PharmaPulse.order.api.dto.PriceListDTO;
import java.util.List;

public interface PriceListService {
    List<PriceListDTO> getCurrentPriceList();
    void updatePriceListForProduct(Long productId, PriceListDTO priceListDTO);
}
