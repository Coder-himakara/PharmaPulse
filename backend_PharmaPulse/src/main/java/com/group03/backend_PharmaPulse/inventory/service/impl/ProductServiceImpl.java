package com.group03.backend_PharmaPulse.inventory.service.impl;

import com.group03.backend_PharmaPulse.inventory.dto.ProductDTO;
import com.group03.backend_PharmaPulse.inventory.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Override
    public List<ProductDTO> getAllProducts() {
        return null;
    }

    @Override
    public ProductDTO getProductsById(String id) {
        return null;
    }

    @Override
    public ProductDTO addProducts(ProductDTO productDTO) {
        return null;
    }

    @Override
    public ProductDTO updateProducts(String id, ProductDTO productDTO) {
        return null;
    }
}
