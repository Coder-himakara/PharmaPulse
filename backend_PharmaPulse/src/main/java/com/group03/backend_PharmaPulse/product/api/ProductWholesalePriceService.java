package com.group03.backend_PharmaPulse.product.api;


import java.math.BigDecimal;

public interface ProductWholesalePriceService {
    void checkAndUpdateRetailPrice(Long productId, BigDecimal newUnitPrice);
}
