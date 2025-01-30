package com.group03.backend_PharmaPulse.inventory.service.impl;

import com.group03.backend_PharmaPulse.inventory.dto.ProductRetailPriceDTO;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.inventory.entity.ProductRetailPrice;
import com.group03.backend_PharmaPulse.inventory.mapper.ProductRetailPriceMapper;
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
    private final ProductRetailPriceMapper productRetailPriceMapper;

    public ProductRetailPriceServiceImpl(ProductRetailPriceRepo retailPriceRepository,
                                         ProductRetailPriceMapper productRetailPriceMapper) {
        this.retailPriceRepository = retailPriceRepository;
        this.productRetailPriceMapper = productRetailPriceMapper;
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
                    !mostRecentPrice.getRetailPrice().equals(suggestedRetailPrice)) {

                if (mostRecentPrice != null) {
                    mostRecentPrice.setEndDate(LocalDateTime.now());
                    retailPriceRepository.save(mostRecentPrice);
                }
                //Create new retail price record
                /**ProductRetailPrice newRetailPrice = new ProductRetailPrice();
                newRetailPrice.setProduct(product);
                newRetailPrice.setRetailPrice(suggestedRetailPrice);
                newRetailPrice.setEffectiveDate(LocalDateTime.now());
                newRetailPrice.setCreatedBy("Purchase Order");
                retailPriceRepository.save(newRetailPrice);**/

                ProductRetailPriceDTO newRetailPriceDTO = new ProductRetailPriceDTO();
                newRetailPriceDTO.setProduct(product.getProductId());
                newRetailPriceDTO.setRetailPrice(suggestedRetailPrice);
                newRetailPriceDTO.setEffectiveDate(LocalDateTime.now());
                newRetailPriceDTO.setCreatedBy("Purchase Order");
                retailPriceRepository.save(productRetailPriceMapper.toEntity(newRetailPriceDTO));

            }
        }catch (Exception e){
            logger.error("Error updating retail price for product: " + product.getProductId(), e);
        }

    }
}
