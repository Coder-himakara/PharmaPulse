package com.group03.backend_PharmaPulse.inventory.mapper;

import com.group03.backend_PharmaPulse.common.entity.Invoice;
import com.group03.backend_PharmaPulse.inventory.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BatchInventoryMapper {
    @Mapping(target = "batchId",ignore = true)
    @Mapping(target = "product", source = "product", qualifiedByName = "mapProduct")
    @Mapping(target = "invoice", source = "invoice", qualifiedByName = "mapPurchaseInvoice")
    BatchInventory toEntity(BatchInventoryDTO batchInventoryDTO);

    @Mapping(target = "product", source = "product.productId")
    @Mapping(target = "invoice", source = "invoice.invoiceId")
    BatchInventoryDTO toDTO(BatchInventory batchInventory);

    List<BatchInventoryDTO> toDTOsList(List<BatchInventory> batchInventories);


    @Named("mapProduct")
    default Product mapProduct(String productId) {
        Product product = new Product();
        product.setProductId(productId);
        return product;
    }
    @Named("mapPurchaseInvoice")
    default Invoice mapPurchaseInvoice(Long invoiceId) {
        Invoice purchaseInvoice = new Invoice();
        purchaseInvoice.setInvoiceId(invoiceId);
        return purchaseInvoice;
    }

}
