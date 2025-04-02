package com.group03.backend_PharmaPulse.product.api;

import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.product.api.dto.response.ProductCountDTO;
import com.group03.backend_PharmaPulse.product.api.enumeration.ProductStatus;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;

import java.util.List;

public interface ProductService {
    ProductDTO getProductById(Long id);
    Product getProductEntityById(Long id);
    ProductDTO addProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    List<ProductDTO> getAllProducts();
    List<ProductCountDTO> getProductsByStatus(ProductStatus status);
}
