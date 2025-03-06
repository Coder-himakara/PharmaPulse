package com.group03.backend_PharmaPulse.product.api;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface ProductWholesalePriceService {
    void checkAndUpdateWholesalePrice(Long productId, BigDecimal newUnitPrice);

    //new
    Optional<BigDecimal> getLatestWholesalePrice(Long productId);

}
