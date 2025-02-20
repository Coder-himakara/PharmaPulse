package com.group03.backend_PharmaPulse.product.internal.serviceImpl;

import com.group03.backend_PharmaPulse.product.api.ProductWholesalePriceService;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductWholesalePrice;
import com.group03.backend_PharmaPulse.product.internal.repository.ProductWholesalePriceRepo;
import com.group03.backend_PharmaPulse.purchase.api.event.PurchaseLineItemEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
public class ProductWholesalePriceServiceImpl implements ProductWholesalePriceService {
    private final ProductWholesalePriceRepo wholesalePriceRepo;
    private final ProductService productService;


    public ProductWholesalePriceServiceImpl(ProductWholesalePriceRepo wholesalePriceRepo,
                                            ProductService productService) {
        this.wholesalePriceRepo = wholesalePriceRepo;
        this.productService = productService;
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
        Product product =productService.getProductEntityById(productId);
        if (newUnitPrice == null) {
            throw new IllegalArgumentException("New unit price cannot be null");
        }
        try {
            ProductWholesalePrice mostRecentPrice = wholesalePriceRepo
                    .findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(product)
                    .orElse(null);

            //Add the logic to calculate the suggested retail price here if there is one
            BigDecimal suggestedRetailPrice = newUnitPrice;
            // Check if the new price is different from the most recent one.
            if (mostRecentPrice == null || !mostRecentPrice.getWholesalePrice().equals(suggestedRetailPrice)) {

                if (mostRecentPrice != null) {
                    // Mark the previous price as ended
                    mostRecentPrice.setEndDate(LocalDateTime.now());
                    wholesalePriceRepo.save(mostRecentPrice);
                }
                // Create and save a new wholesale price record
                ProductWholesalePrice newWholesalePrice = new ProductWholesalePrice();
                newWholesalePrice.setProduct(product);
                newWholesalePrice.setWholesalePrice(suggestedRetailPrice);
                newWholesalePrice.setEffectiveDate(LocalDateTime.now());
                newWholesalePrice.setCreatedBy("Purchase Order");
                wholesalePriceRepo.save(newWholesalePrice);

                logger.info("Updated wholesale price for product: {} from {} to {}",
                        product.getProductId(),
                        mostRecentPrice != null ? mostRecentPrice.getWholesalePrice() : "N/A",
                        suggestedRetailPrice);
            }
        } catch (Exception e) {
            logger.error("Error updating wholesale price for product: {}", product.getProductId(), e);
            throw new RuntimeException("Failed to update wholesale price", e);
        }
    }

    @EventListener
    public void getNewlyPurchasedItems(PurchaseLineItemEvent purchaseLineItemEvent){
        purchaseLineItemEvent.getPurchaseLineItemDTOS()
                .forEach(dto ->
                        checkAndUpdateWholesalePrice(dto.getProductId(), dto.getUnitPrice()));
    }

}
