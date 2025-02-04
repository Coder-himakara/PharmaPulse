package com.group03.backend_PharmaPulse.product.api;

import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    ProductDTO getProductById(String id);
    ProductDTO addProduct(ProductDTO productDTO);
    ProductDTO updateProduct(String id, ProductDTO productDTO);
    List<ProductDTO> getAllProducts();
}
