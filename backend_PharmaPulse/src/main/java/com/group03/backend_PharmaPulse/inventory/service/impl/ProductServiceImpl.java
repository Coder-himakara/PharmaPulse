package com.group03.backend_PharmaPulse.inventory.service.impl;

import com.group03.backend_PharmaPulse.exception.NotFoundException;
import com.group03.backend_PharmaPulse.inventory.dto.ProductDTO;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.inventory.mapper.ProductMapper;
import com.group03.backend_PharmaPulse.inventory.repository.ProductRepo;
import com.group03.backend_PharmaPulse.inventory.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private ProductRepo productRepo;
    private ProductMapper productMapper;
    public ProductServiceImpl(ProductRepo productRepo, ProductMapper productMapper) {
        this.productRepo = productRepo;
        this.productMapper = productMapper;
    }
    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products= productRepo.findAll();
        if(!products.isEmpty()){
            return productMapper.toDTOsList(products);
        }else{
            throw new NotFoundException("No Products found");
        }
    }

    @Override
    public ProductDTO getProductsById(String id) {
        Optional<Product> product= productRepo.findById(id);
        return product.map(productMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Override
    public ProductDTO addProducts(ProductDTO productDTO) {
        Product savedProduct= productRepo.save(productMapper.toEntity(productDTO));
        return productMapper.toDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProducts(String id, ProductDTO productDTO) {
        Optional<Product> product = productRepo.findById(id);
        if (product.isPresent()) {
            Product updatedProduct = productMapper.toEntity(productDTO);
            updatedProduct.setProduct_id(id); // Ensure the ID is set to the existing entity's ID
            Product savedProduct = productRepo.save(updatedProduct);
            return productMapper.toDTO(savedProduct);
        } else {
            throw new NotFoundException("Product not found");
        }
    }
}
