package com.group03.backend_PharmaPulse.inventory.mapper;

import com.group03.backend_PharmaPulse.inventory.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.entity.Product;
import com.group03.backend_PharmaPulse.purchase.entity.PurchaseInvoice;
import com.group03.backend_PharmaPulse.purchase.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BatchInventoryMapper {
    @Mapping(target = "batchId",ignore = true)
    @Mapping(target = "product", source = "product", qualifiedByName = "mapProduct")
    @Mapping(target = "supplier", source = "supplier", qualifiedByName = "mapSupplier")
    @Mapping(target = "purchaseInvoice", source = "purchaseInvoice", qualifiedByName = "mapPurchaseInvoice")
    BatchInventory toEntity(BatchInventoryDTO batchInventoryDTO);

    @Mapping(target = "product", source = "product.productId")
    @Mapping(target = "supplier", source = "supplier.supplier_id")
    @Mapping(target = "purchaseInvoice", source = "purchaseInvoice.purchaseNo")
    BatchInventoryDTO toDTO(BatchInventory batchInventory);

    List<BatchInventoryDTO> toDTOsList(List<BatchInventory> batchInventories);


    @Named("mapProduct")
    default Product mapProduct(String productId) {
        Product product = new Product();
        product.setProductId(productId);
        return product;
    }
    @Named("mapSupplier")
    default Supplier mapSupplier(int supplierId) {
        Supplier supplier = new Supplier();
        supplier.setSupplier_id(supplierId);
        return supplier;
    }
    @Named("mapPurchaseInvoice")
    default PurchaseInvoice mapPurchaseInvoice(int purchaseInvoiceNo) {
        PurchaseInvoice purchaseInvoice = new PurchaseInvoice();
        purchaseInvoice.setPurchaseNo(purchaseInvoiceNo);
        return purchaseInvoice;
    }

}
