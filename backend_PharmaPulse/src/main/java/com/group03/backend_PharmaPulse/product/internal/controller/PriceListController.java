package com.group03.backend_PharmaPulse.product.internal.controller;

import com.group03.backend_PharmaPulse.product.api.PriceListService;
import com.group03.backend_PharmaPulse.product.api.dto.PriceListDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/prices")
public class PriceListController {
    private final PriceListService priceListService;

    public PriceListController(PriceListService priceListService) {
        this.priceListService = priceListService;
    }

    @GetMapping
    public ResponseEntity<StandardResponse> getPriceList() {
        List<PriceListDTO> prices = priceListService.getAllCurrentPrices();
        return new ResponseEntity<>(
                new StandardResponse(200, "Price list retrieved successfully", prices),
                HttpStatus.OK
        );
    }
}