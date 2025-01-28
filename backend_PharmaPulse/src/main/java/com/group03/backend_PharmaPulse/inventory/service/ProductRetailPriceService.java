package com.group03.backend_PharmaPulse.inventory.service;

import com.group03.backend_PharmaPulse.inventory.entity.Product;

import java.math.BigDecimal;

public interface ProductRetailPriceService {
    void checkAndUpdateRetailPrice(Product product, BigDecimal newUnitPrice);
}
