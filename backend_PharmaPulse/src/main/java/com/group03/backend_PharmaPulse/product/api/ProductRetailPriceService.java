package com.group03.backend_PharmaPulse.product.api;


import java.math.BigDecimal;

public interface ProductRetailPriceService {
    void checkAndUpdateRetailPrice(String productId, BigDecimal newUnitPrice);


}
