package com.group03.backend_PharmaPulse.order.internal.controller;

import com.group03.backend_PharmaPulse.order.api.PriceListService;
import com.group03.backend_PharmaPulse.order.api.dto.PriceListDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/price-list")
public class PriceListController {

    private final PriceListService priceListService;

    public PriceListController(PriceListService priceListService) {
        this.priceListService = priceListService;
    }

    @GetMapping
    public ResponseEntity<List<PriceListDTO>> getPriceList() {
        return ResponseEntity.ok(priceListService.getCurrentPriceList());
    }
}
