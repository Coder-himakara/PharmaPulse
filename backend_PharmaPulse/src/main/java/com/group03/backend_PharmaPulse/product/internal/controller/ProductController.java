package com.group03.backend_PharmaPulse.product.internal.controller;

import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllProducts() {
        List<ProductDTO> productDTOS  = productService.getAllProducts();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",productDTOS),
                HttpStatus.OK
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getProductsById(@PathVariable Long id) {
        ProductDTO selectedProduct = productService.getProductById(id);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",selectedProduct),
                HttpStatus.OK
        );
    }
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addProducts(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct=productService.addProduct(productDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedProduct),
                HttpStatus.CREATED
        );
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateProducts(@Valid @PathVariable Long id,
                                                           @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProducts=productService.updateProduct(id,productDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",updatedProducts),
                HttpStatus.CREATED
        );
    }
}
