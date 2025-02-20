package com.group03.backend_PharmaPulse.product.internal.controller;

import com.group03.backend_PharmaPulse.product.api.PriceListService;
import com.group03.backend_PharmaPulse.product.api.dto.PriceListDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/pricelist")
public class PriceListController {
    private final PriceListService priceListService;

    public PriceListController(PriceListService priceListService) {
        this.priceListService = priceListService;
    }

    @GetMapping
    public List<PriceListDTO> getPriceList() {
        return priceListService.getAllProductPriceList();
    }
}
