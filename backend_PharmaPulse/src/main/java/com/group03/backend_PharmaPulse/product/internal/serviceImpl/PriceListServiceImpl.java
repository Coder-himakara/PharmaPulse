package com.group03.backend_PharmaPulse.product.internal.serviceImpl;

import com.group03.backend_PharmaPulse.product.api.PriceListService;
import com.group03.backend_PharmaPulse.product.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.entity.ProductWholesalePrice;
import com.group03.backend_PharmaPulse.product.internal.mapper.PriceListMapper;
import com.group03.backend_PharmaPulse.product.internal.repository.ProductRepo;
import com.group03.backend_PharmaPulse.product.internal.repository.ProductWholesalePriceRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceListServiceImpl implements PriceListService {
    private final ProductRepo productRepo;
    private final ProductWholesalePriceRepo wholesalePriceRepo;
    private final PriceListMapper priceListMapper;

    @Override
    public List<PriceListDTO> getAllCurrentPrices() {
        return productRepo.findAll().stream()
                .map(product -> {
                    ProductWholesalePrice price = wholesalePriceRepo
                            .findTopByProductAndEndDateIsNullOrderByEffectiveDateDesc(product)
                            .orElse(null);
                    return priceListMapper.toDTO(product, price);
                })
                .collect(Collectors.toList());
    }
}