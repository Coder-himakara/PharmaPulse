package com.group03.backend_PharmaPulse.product.internal.controller;

import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.ProductWholesalePriceService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.product.api.dto.ProductWholesalePriceDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/products")
@PreAuthorize("hasAnyRole('EMPLOYEE','SALES_REP')")
public class ProductController {
    private final ProductService productService;
    private final ProductWholesalePriceService productWholesalePriceService;
    public ProductController(ProductService productService,ProductWholesalePriceService productWholesalePriceService
                             ) {
        this.productService = productService;
        this.productWholesalePriceService = productWholesalePriceService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('employee:read','sales_rep:read')")
    public ResponseEntity<StandardResponse> getAllProducts() {
        List<ProductDTO> productDTOS  = productService.getAllProducts();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",productDTOS),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('employee:read','sales_rep:read')")
    public ResponseEntity<StandardResponse> getProductsById(@PathVariable Long id) {
        ProductDTO selectedProduct = productService.getProductById(id);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",selectedProduct),
                HttpStatus.OK
        );
    }

    @PostMapping("/add")
    // This endpoint remains restricted to EMPLOYEE (or adjust if needed)
    @PreAuthorize("hasAuthority('employee:create')")
    public ResponseEntity<StandardResponse> addProducts(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.addProduct(productDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedProduct),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/update/{id}")
    // This endpoint remains restricted to EMPLOYEE (or adjust if needed)
    @PreAuthorize("hasAuthority('employee:update')")
    public ResponseEntity<StandardResponse> updateProducts(@Valid @PathVariable Long id,
                                                           @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProducts = productService.updateProduct(id, productDTO);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",updatedProducts),
                HttpStatus.CREATED
        );
    }
    // New endpoint for wholesale price history
    @GetMapping("/wholesale-prices/{id}")

    public ResponseEntity<StandardResponse> getProductWholesalePrices(@PathVariable Long id) {
        List<ProductWholesalePriceDTO> prices = productWholesalePriceService.getWholesalePriceHistory(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Wholesale price history retrieved", prices),
                HttpStatus.OK
        );
    }

}
