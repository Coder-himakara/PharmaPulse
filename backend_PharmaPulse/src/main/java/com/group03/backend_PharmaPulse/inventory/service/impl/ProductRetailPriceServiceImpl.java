package com.group03.backend_PharmaPulse.inventory.service.impl;

import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.inventory.entity.ProductRetailPrice;
import com.group03.backend_PharmaPulse.inventory.repository.ProductRetailPriceRepo;
import com.group03.backend_PharmaPulse.inventory.service.ProductRetailPriceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
public class ProductRetailPriceServiceImpl implements ProductRetailPriceService {

    private final ProductRetailPriceRepo retailPriceRepository;

    public ProductRetailPriceServiceImpl(ProductRetailPriceRepo retailPriceRepository) {
        this.retailPriceRepository = retailPriceRepository;
    }
    /**
     * Checks and updates the retail price of a product while adding a new purchase invoice.
     */
    @Override
    public void checkAndUpdateRetailPrice(Product product, BigDecimal newUnitPrice) {
        Logger logger = LoggerFactory.getLogger(ProductRetailPriceServiceImpl.class);
        try {
            ProductRetailPrice mostRecentPrice = retailPriceRepository
                    .findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(product)
                    .orElse(null);

            //new retail price (if client asks we can add a margin to the new price)
            BigDecimal suggestedRetailPrice = newUnitPrice;

            if (mostRecentPrice == null ||
                    !mostRecentPrice.getRetail_price().equals(suggestedRetailPrice)) {

                if (mostRecentPrice != null) {
                    mostRecentPrice.setEndDate(LocalDateTime.now());
                    retailPriceRepository.save(mostRecentPrice);
                }
                //Create new retail price record
                ProductRetailPrice newRetailPrice = new ProductRetailPrice();
                newRetailPrice.setProduct(product);
                newRetailPrice.setRetail_price(suggestedRetailPrice);
                newRetailPrice.setEffectiveDate(LocalDateTime.now());
                newRetailPrice.setCreated_by("Purchase Order");

                retailPriceRepository.save(newRetailPrice);
            }
        }catch (Exception e){
            logger.error("Error updating retail price for product: " + product.getProduct_id(), e);
        }

    }
}
