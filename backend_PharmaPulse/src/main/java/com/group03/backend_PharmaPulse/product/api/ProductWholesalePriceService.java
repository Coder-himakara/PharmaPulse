package com.group03.backend_PharmaPulse.product.api;


import com.group03.backend_PharmaPulse.product.api.dto.ProductWholesalePriceDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductWholesalePriceService {
    void checkAndUpdateWholesalePrice(Long productId, BigDecimal newUnitPrice);

    //new
    Optional<BigDecimal> getLatestWholesalePrice(Long productId);

    // New method for price history
    List<ProductWholesalePriceDTO> getWholesalePriceHistory(Long productId);


}
