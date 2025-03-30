package com.group03.backend_PharmaPulse.order.internal.service;

import com.group03.backend_PharmaPulse.order.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.order.api.PriceListService;
import com.group03.backend_PharmaPulse.order.internal.entity.PriceList;
import com.group03.backend_PharmaPulse.order.internal.mapper.PriceListMapper;
import com.group03.backend_PharmaPulse.order.internal.repository.PriceListRepository;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PriceListServiceImpl implements PriceListService {

    private final PriceListRepository priceListRepository;
    private final PriceListMapper priceListMapper;
    private final ProductService productService;
    private final BatchInventoryService batchInventoryService;

    public PriceListServiceImpl(PriceListRepository priceListRepository,
                                PriceListMapper priceListMapper,
                                ProductService productService,
                                BatchInventoryService batchInventoryService) {
        this.priceListRepository = priceListRepository;
        this.priceListMapper = priceListMapper;
        this.productService = productService;
        this.batchInventoryService = batchInventoryService;
    }

    @Override
    public List<PriceListDTO> getCurrentPriceList() {
        // Retrieve all products
        List<ProductDTO> products = productService.getAllProducts();
        List<PriceListDTO> priceList = new ArrayList<>();

        for (ProductDTO productDTO : products) {
            // Retrieve all available batches for this product sorted by expiry date
            List<BatchInventoryDTO> batches = batchInventoryService.getBatchesByProductIdSorted(productDTO.getProductId());

            if (batches != null && !batches.isEmpty()) {
                // Create a PriceListDTO row for each batch
                for (BatchInventoryDTO batch : batches) {
                    PriceListDTO dto = PriceListDTO.builder()
                            .productId(productDTO.getProductId())
                            .productRefId(productDTO.getProductRefId())
                            .purchaseGroupId(productDTO.getPurchaseGroupId())
                            .productName(productDTO.getProductName())
                            .genericName(productDTO.getGenericName())
                            .unitsPerPack(productDTO.getUnitsPerPack())
                            .wholesalePrice(batch.getWholesalePrice())
                            .build();
                    priceList.add(dto);
                }
            } 
        }
        return priceList;
    }

    @Override
    @Transactional
    public void updatePriceListForProduct(Long productId, PriceListDTO priceListDTO) {
        Optional<PriceList> optPriceList = priceListRepository.findByProductId(productId);
        PriceList priceList;
        if(optPriceList.isPresent()){
            priceList = optPriceList.get();
            priceList.setWholesalePrice(priceListDTO.getWholesalePrice());
            priceList.setUpdatedAt(LocalDateTime.now());
        } else {
            priceList = priceListMapper.toEntity(priceListDTO);
            priceList.setUpdatedAt(LocalDateTime.now());
        }
        priceListRepository.save(priceList);
    }
}
