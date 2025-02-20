package com.group03.backend_PharmaPulse.product.internal.serviceImpl;

import com.group03.backend_PharmaPulse.product.api.PriceListService;
import com.group03.backend_PharmaPulse.product.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.product.internal.mapper.PriceListMapper;
import com.group03.backend_PharmaPulse.product.internal.repository.ProductRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceListServiceImpl implements PriceListService {
    private final ProductRepo productRepo;
    private final PriceListMapper priceListMapper;

    public PriceListServiceImpl(ProductRepo productRepo, PriceListMapper priceListMapper) {
        this.productRepo = productRepo;
        this.priceListMapper = priceListMapper;
    }

    @Override
    public List<PriceListDTO> getAllProductPriceList() {
        return priceListMapper.toDTOsList(productRepo.findAll());
    }
}
