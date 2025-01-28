package com.group03.backend_PharmaPulse.inventory.controller;

import com.group03.backend_PharmaPulse.inventory.dto.ProductDTO;
import com.group03.backend_PharmaPulse.inventory.service.ProductService;
import com.group03.backend_PharmaPulse.util.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    private ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllProducts() {
        List<ProductDTO> productDTOS  = productService.getAllProducts();
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",productDTOS),
                HttpStatus.OK
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getProductsById(@PathVariable String id) {
        ProductDTO selectedProduct = productService.getProductsById(id);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",selectedProduct),
                HttpStatus.FOUND
        );
    }
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addProducts(@Valid
                                                              @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct=productService.addProducts(productDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedProduct),
                HttpStatus.CREATED
        );
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updateProducts(@Valid @PathVariable String id,
                                                                 @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProducts=productService.updateProducts(id,productDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",updatedProducts),
                HttpStatus.CREATED
        );

    }
}
