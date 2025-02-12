package com.group03.backend_PharmaPulse.product.internal.serviceImpl;

import com.group03.backend_PharmaPulse.product.api.ProductWholesalePriceService;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductWholesalePrice;
import com.group03.backend_PharmaPulse.product.internal.mapper.ProductMapper;
import com.group03.backend_PharmaPulse.product.internal.mapper.ProductWholesalePriceMapper;
import com.group03.backend_PharmaPulse.product.internal.repository.ProductWholesalePriceRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ProductWholesalePriceServiceImpl implements ProductWholesalePriceService {
    private final ProductWholesalePriceRepo wholesalePriceRepo;
    private final ProductWholesalePriceMapper productWholesalePriceMapper;
    private final ProductService productService;
    private final ProductMapper productMapper;

    public ProductWholesalePriceServiceImpl(ProductWholesalePriceRepo wholesalePriceRepo,
                                            ProductWholesalePriceMapper productWholesalePriceMapper,
                                            ProductService productService, ProductMapper productMapper) {
        this.wholesalePriceRepo = wholesalePriceRepo;
        this.productWholesalePriceMapper = productWholesalePriceMapper;
        this.productService = productService;
        this.productMapper = productMapper;
    }
    /**
     * This method checks if the new unit price is different from the most recent wholesale price for the product.
     * If it is different, it updates the most recent wholesale price to have an end date and creates a new wholesale price
     * with the new unit price.
     *
     * @param productId    The ID of the product to update the wholesale price for
     * @param newUnitPrice The new unit price to set
     */
    @Override
    public void checkAndUpdateWholesalePrice(Long productId, BigDecimal newUnitPrice) {
        Logger logger = LoggerFactory.getLogger(ProductWholesalePriceServiceImpl.class);
        Product product =productMapper.toEntity(productService.getProductById(productId)) ;
        if (newUnitPrice == null) {
            throw new IllegalArgumentException("New unit price cannot be null");
        }
        try {
            ProductWholesalePrice mostRecentPrice = wholesalePriceRepo
                    .findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(product)
                    .orElse(null);

            //Add the logic to calculate the suggested retail price here if there is one
            BigDecimal suggestedRetailPrice = newUnitPrice;

            if (mostRecentPrice == null || !mostRecentPrice.getWholesalePrice().equals(suggestedRetailPrice)) {

                if (mostRecentPrice != null) {
                    mostRecentPrice.setEndDate(LocalDateTime.now());
                    wholesalePriceRepo.save(mostRecentPrice);
                }

                ProductWholesalePrice newWholesalePrice = new ProductWholesalePrice();
                newWholesalePrice.setProduct(product);
                newWholesalePrice.setWholesalePrice(suggestedRetailPrice);
                newWholesalePrice.setEffectiveDate(LocalDateTime.now());
                newWholesalePrice.setCreatedBy("Purchase Order");
                wholesalePriceRepo.save(newWholesalePrice);

                logger.info("Updated retail price for product: {} from {} to {}",
                        product.getProductId(),
                        mostRecentPrice != null ? mostRecentPrice.getWholesalePrice() : "N/A",
                        suggestedRetailPrice);
            }
        } catch (Exception e) {
            logger.error("Error updating retail price for product: " + product.getProductId(), e);
            throw new RuntimeException("Failed to update retail price", e);
        }
    }
}
