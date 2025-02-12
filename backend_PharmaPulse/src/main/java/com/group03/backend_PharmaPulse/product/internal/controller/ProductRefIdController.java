package com.group03.backend_PharmaPulse.product.internal.controller;

import com.group03.backend_PharmaPulse.product.api.ProductReferenceIdGenerator;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("api/product-ref-id")
public class ProductRefIdController {
    private final ProductReferenceIdGenerator productReferenceIdGenerator;

    public ProductRefIdController(ProductReferenceIdGenerator productReferenceIdGenerator) {
        this.productReferenceIdGenerator = productReferenceIdGenerator;
    }
    @PostMapping("/generate")
    @ResponseBody
    public String generateProductRefId(@RequestBody String supplierId) {
        return productReferenceIdGenerator.generateProductReferenceId(supplierId);
    }
}
