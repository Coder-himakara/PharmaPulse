package com.group03.backend_PharmaPulse.inventory.api.dto.response;

import com.group03.backend_PharmaPulse.product.api.dto.response.ProductCountDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StockCountDTO {
    int totalStock;
    int availableStock;
    int lowStock;
    int outOfStock;
    List<ProductCountDTO> outOfStockProducts;
    List<ProductCountDTO> lowStockProducts;
}
