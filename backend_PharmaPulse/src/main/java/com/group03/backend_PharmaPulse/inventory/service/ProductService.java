package com.group03.backend_PharmaPulse.inventory.service;

import com.group03.backend_PharmaPulse.inventory.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    ProductDTO getProductsById(String id);
    ProductDTO addProducts(ProductDTO productDTO);
    ProductDTO updateProducts(String id, ProductDTO productDTO);
}
