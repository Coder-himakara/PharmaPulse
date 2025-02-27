package com.group03.backend_PharmaPulse.order.internal.serviceImpl;

import com.group03.backend_PharmaPulse.order.api.PriceListService;
import com.group03.backend_PharmaPulse.order.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.order.internal.entity.PriceList;
import com.group03.backend_PharmaPulse.order.internal.mapper.PriceListMapper;
import com.group03.backend_PharmaPulse.order.internal.repository.PriceListRepository;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.product.internal.repository.ProductWholesalePriceRepo;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductWholesalePrice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PriceListServiceImpl implements PriceListService {

    private final PriceListRepository priceListRepository;
    private final PriceListMapper priceListMapper;
    private final ProductService productService;
    private final ProductWholesalePriceRepo wholesalePriceRepo;

    public PriceListServiceImpl(PriceListRepository priceListRepository,
                                PriceListMapper priceListMapper,
                                ProductService productService,
                                ProductWholesalePriceRepo wholesalePriceRepo) {
        this.priceListRepository = priceListRepository;
        this.priceListMapper = priceListMapper;
        this.productService = productService;
        this.wholesalePriceRepo = wholesalePriceRepo;
    }

    @Override
    public List<PriceListDTO> getCurrentPriceList() {
        List<ProductDTO> products = productService.getAllProducts();
        return products.stream().map(productDTO -> {
            Optional<ProductWholesalePrice> optWholesale = wholesalePriceRepo
                    .findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(
                            productService.getProductEntityById(productDTO.getProductId()));
            BigDecimal wholesalePrice = optWholesale.map(ProductWholesalePrice::getWholesalePrice)
                    .orElse(BigDecimal.ZERO);
            return PriceListDTO.builder()
                    .productId(productDTO.getProductId())
                    .productRefId(productDTO.getProductRefId())
                    .purchaseGroupId(productDTO.getPurchaseGroupId())
                    .productName(productDTO.getProductName())
                    .genericName(productDTO.getGenericName())
                    .unitsPerPack(productDTO.getUnitsPerPack())
                    .wholesalePrice(wholesalePrice)
                    .build();
        }).collect(Collectors.toList());
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
