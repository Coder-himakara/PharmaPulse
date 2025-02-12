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
    private final ProductWholesalePriceRepo retailPriceRepository;
    private final ProductWholesalePriceMapper productWholesalePriceMapper;
    private final ProductService productService;
    private final ProductMapper productMapper;

    public ProductWholesalePriceServiceImpl(ProductWholesalePriceRepo retailPriceRepository,
                                            ProductWholesalePriceMapper productWholesalePriceMapper,
                                            ProductService productService, ProductMapper productMapper) {
        this.retailPriceRepository = retailPriceRepository;
        this.productWholesalePriceMapper = productWholesalePriceMapper;
        this.productService = productService;
        this.productMapper = productMapper;
    }

    @Override
    public void checkAndUpdateRetailPrice(Long productId, BigDecimal newUnitPrice) {
        Logger logger = LoggerFactory.getLogger(ProductWholesalePriceServiceImpl.class);
        Product product =productMapper.toEntity(productService.getProductById(productId)) ;
        if (newUnitPrice == null) {
            throw new IllegalArgumentException("New unit price cannot be null");
        }
        try {
            ProductWholesalePrice mostRecentPrice = retailPriceRepository
                    .findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(product)
                    .orElse(null);

            //Add the logic to calculate the suggested retail price here if there is one
            BigDecimal suggestedRetailPrice = newUnitPrice;

            if (mostRecentPrice == null || !mostRecentPrice.getRetailPrice().equals(suggestedRetailPrice)) {

                if (mostRecentPrice != null) {
                    mostRecentPrice.setEndDate(LocalDateTime.now());
                    retailPriceRepository.save(mostRecentPrice);
                }

                ProductWholesalePrice newRetailPrice = new ProductWholesalePrice();
                newRetailPrice.setProduct(product);
                newRetailPrice.setRetailPrice(suggestedRetailPrice);
                newRetailPrice.setEffectiveDate(LocalDateTime.now());
                newRetailPrice.setCreatedBy("Purchase Order");
                retailPriceRepository.save(newRetailPrice);

                logger.info("Updated retail price for product: {} from {} to {}",
                        product.getProductId(),
                        mostRecentPrice != null ? mostRecentPrice.getRetailPrice() : "N/A",
                        suggestedRetailPrice);
            }
        } catch (Exception e) {
            logger.error("Error updating retail price for product: " + product.getProductId(), e);
            throw new RuntimeException("Failed to update retail price", e);
        }
    }
}
