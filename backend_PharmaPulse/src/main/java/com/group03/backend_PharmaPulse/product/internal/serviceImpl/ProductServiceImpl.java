package com.group03.backend_PharmaPulse.product.internal.serviceImpl;

import com.group03.backend_PharmaPulse.product.api.dto.response.ProductCountDTO;
import com.group03.backend_PharmaPulse.product.api.enumeration.ProductStatus;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.product.internal.entity.Product;
import com.group03.backend_PharmaPulse.product.internal.mapper.ProductMapper;
import com.group03.backend_PharmaPulse.product.internal.repository.ProductRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepo productRepo;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepo productRepo, ProductMapper productMapper) {
        this.productRepo = productRepo;
        this.productMapper = productMapper;
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepo.findAll();
        if(!products.isEmpty()){
            return productMapper.toDTOsList(products);
        }else{
            throw new NotFoundException("No Products found");
        }
    }
    @Override
    public List<ProductCountDTO> getProductsByStatus(ProductStatus status) {
        List<Product> products = productRepo.findByProductStatus(status);
        if(!products.isEmpty()){
            return productMapper.toProductCountDTOsList(products);
        }else{
            throw new NotFoundException("No Products found");
        }
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Optional<Product> product = productRepo.findById(id);
        return product.map(productMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Override
    public Product getProductEntityById(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Override
    public ProductDTO addProduct(ProductDTO productDTO) {
        Product savedProduct = productRepo.save(productMapper.toEntity(productDTO));
        return productMapper.toDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
       Optional<Product> product = productRepo.findById(id);
        if (product.isPresent()) {
            Product updatedProduct = productMapper.toEntity(productDTO);
            updatedProduct.setProductId(id); // Ensure the ID is set to the existing entity's ID
            Product savedProduct = productRepo.save(updatedProduct);
            return productMapper.toDTO(savedProduct);
        } else {
            throw new NotFoundException("Product not found");
        }
    }
}
