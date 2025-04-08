package com.group03.backend_PharmaPulse.report.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ExpiryAlertDTO;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.enumeration.ProductStatus;
import com.group03.backend_PharmaPulse.purchase.api.SupplierService;
import com.group03.backend_PharmaPulse.report.api.EmployeeDashBoardService;
import com.group03.backend_PharmaPulse.report.api.dto.EmployeeDashBoardCountsDTO;
import com.group03.backend_PharmaPulse.sales.api.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeDashBoardServiceImpl implements EmployeeDashBoardService {
    private final ProductService productService;
    private final SupplierService supplierService;
    private final CustomerService customerService;
    private final BatchInventoryService batchInventoryService;

    public EmployeeDashBoardServiceImpl(ProductService productService, SupplierService supplierService,
                                        CustomerService customerService,
                                        BatchInventoryService batchInventoryService) {
        this.productService = productService;
        this.supplierService = supplierService;
        this.customerService = customerService;
        this.batchInventoryService = batchInventoryService;
    }

    @Override
    public EmployeeDashBoardCountsDTO getEmployeeDashBoardCounts() {
        int productCount = 0;
        int supplierCount = 0;
        int customerCount = 0;
        int expiredStockQuantity = 0;

        try {
            productCount = productService.getProductsByStatus(ProductStatus.ACTIVE) != null ?
                    productService.getProductsByStatus(ProductStatus.ACTIVE).size() : 0;
        } catch (Exception e) {
            // If product data can't be fetched, productCount remains 0
        }
        try {
            supplierCount = supplierService.getAllSuppliers() != null ?
                    supplierService.getAllSuppliers().size() : 0;
        } catch (Exception e) {
            // If supplier data can't be fetched, supplierCount remains 0
        }
        try {
            customerCount = customerService.getAllCustomers() != null ?
                    customerService.getAllCustomers().size() : 0;
        } catch (Exception e) {
            // If customer data can't be fetched, customerCount remains 0
        }
        try{
            expiredStockQuantity = getExpiredNotExpiredCount();
        }catch (Exception e){
            // If expired stock data can't be fetched, expiredStockQuantity remains 0
        }
        return EmployeeDashBoardCountsDTO.builder()
                .productCount(productCount)
                .supplierCount(supplierCount)
                .customerCount(customerCount)
                .expiredStockQuantity(expiredStockQuantity)
                .build();
    }


    private int getExpiredNotExpiredCount() {
        int expiredCount = 0;

        try {
            // Get expired batches using batchInventoryService
            List<ExpiryAlertDTO> expiredAlertsDTO = batchInventoryService.getExpiredBatches();

            if (expiredAlertsDTO != null) {
                // Sum up quantities across all batches in all expired alerts
                for (ExpiryAlertDTO alert : expiredAlertsDTO) {
                    if (alert.getBatches() != null) {
                        for (BatchInventoryDTO batch : alert.getBatches()) {
                            // Add the available quantity of each batch
                            expiredCount += batch.getAvailableUnitQuantity() != null ?
                                    batch.getAvailableUnitQuantity() : 0;
                        }
                    }
                }
            }
        } catch (Exception e) {
            // If expired product data can't be fetched, expiredCount remains 0
            e.printStackTrace();
        }

        return expiredCount;
    }
}
