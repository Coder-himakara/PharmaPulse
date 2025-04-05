package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ExpiryAlertDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ReorderAlertDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.BatchInventoryDetailsDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.ExpiryCountDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.StockCountDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.BatchStatus;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import com.group03.backend_PharmaPulse.inventory.internal.entity.WarehouseInventory;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.BatchInventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.BatchInventoryRepo;
import com.group03.backend_PharmaPulse.inventory.internal.repository.InventoryLocationRepo;
import com.group03.backend_PharmaPulse.inventory.internal.repository.WarehouseInventoryRepo;
import com.group03.backend_PharmaPulse.inventory.api.BatchInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.event.BatchInventoryEvent;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import com.group03.backend_PharmaPulse.product.api.dto.response.ProductCountDTO;
import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseLineItemDTO;
import com.group03.backend_PharmaPulse.purchase.api.event.PurchaseLineItemEvent;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.group03.backend_PharmaPulse.product.api.enumeration.ProductStatus.ACTIVE;

@Service
public class BatchInventoryServiceImpl implements BatchInventoryService {
    private final BatchInventoryRepo batchInventoryRepo;
    private final BatchInventoryMapper batchInventoryMapper;
    private final ProductService productService;
    private final ApplicationEventPublisher eventPublisher;
    private final InventoryLocationRepo inventoryLocationRepo;
    private final WarehouseInventoryRepo warehouseInventoryRepo;
    private static final Logger logger = LoggerFactory.getLogger(BatchInventoryServiceImpl.class);

    public BatchInventoryServiceImpl(BatchInventoryRepo batchInventoryRepo,
                                     BatchInventoryMapper batchInventoryMapper,
                                     ProductService productService,
                                     ApplicationEventPublisher eventPublisher,
                                     InventoryLocationRepo inventoryLocationRepo,
                                     WarehouseInventoryRepo warehouseInventoryRepo) {
        this.batchInventoryRepo=batchInventoryRepo;
        this.batchInventoryMapper=batchInventoryMapper;
        this.productService=productService;
        this.eventPublisher = eventPublisher;
        this.inventoryLocationRepo = inventoryLocationRepo;
        this.warehouseInventoryRepo = warehouseInventoryRepo;
    }

    @Override
    public List<BatchInventoryDTO> getAllBatchInventories() {
        List<BatchInventory> batchInventories = batchInventoryRepo.findAll();
        if(!batchInventories.isEmpty()){
            return batchInventoryMapper.toDTOsList(batchInventories);
        }else{
            throw new NotFoundException("No Batch Inventories found");
        }
    }

    @Override
    public List<BatchInventoryDetailsDTO> getBatchInventoriesDetails() {
        try {
            List<BatchInventory> batchInventories = batchInventoryRepo.findAll();
            if (batchInventories.isEmpty()) {
                throw new NotFoundException("No batch inventories found");
            }
            // Create the details list
            List<BatchInventoryDetailsDTO> detailsList = new ArrayList<>();

            for (BatchInventory batch : batchInventories) {
                // Get product data for each batch
                ProductDTO product = null;
                try {
                    product = productService.getProductById(batch.getProductId());
                } catch (Exception e) {
                    logger.warn("Failed to fetch product details for batch ID {}: {}",
                            batch.getBatchId(), e.getMessage());
                    // Continue with available batch data even if product fetch fails
                }
                BatchInventoryDetailsDTO detailsDTO = BatchInventoryDetailsDTO.builder()
                        .batchId(batch.getBatchId())
                        .productName(product != null ? product.getProductName() : "Unknown Product")
                        .genericName(product != null ? product.getGenericName() : "Unknown")
                        .purchaseInvoiceNo(batch.getPurchaseInvoiceNo())
                        .manufactureDate(batch.getManufactureDate())
                        .expiryDate(batch.getExpiryDate())
                        .purchasedUnitQuantity(batch.getPurchasedUnitQuantity())
                        .freeQuantity(batch.getFreeQuantity())
                        .availableUnitQuantity(batch.getAvailableUnitQuantity())
                        .wholesalePrice(batch.getWholesalePrice())
                        .retailPrice(batch.getRetailPrice())
                        .discount(batch.getDiscount())
                        .batchStatus(batch.getBatchStatus())
                        .dateReceived(batch.getDateReceived())
                        .build();

                detailsList.add(detailsDTO);
                // Check and update batch status if needed
                checkAndUpdateBatchStatus(batch);
            }
            return detailsList;
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching batch inventory details: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve batch inventory details", e);
        }
    }

    @Override
    public BatchInventoryDTO getBatchInventoryById(Long id) {
        Optional<BatchInventory> batchOptional = batchInventoryRepo.findById(id);
        if (batchOptional.isPresent()) {
            BatchInventory batch = batchOptional.get();
            checkAndUpdateBatchStatus(batch);
            return batchInventoryMapper.toDTO(batch);
        }
        throw new NotFoundException("Batch Inventory not found");
    }
    /**
     * Event listener for PurchaseLineItemEvent.
     * BatchInventory record is created for each PurchaseLineItem.
     * @return List<BatchInventory>
     */
    @EventListener
    @Transactional
    public List<BatchInventory> batchInventoryListener(PurchaseLineItemEvent purchaseLineItemEvent) {
        List<BatchInventory> batches = purchaseLineItemEvent.getPurchaseLineItemDTOS()
                .stream()
                .map(this::convertToBatchInventory)
                .toList();
        List<BatchInventory> savedBatches = batchInventoryRepo.saveAll(batches);
        // Publish the BatchInventoryEvent after successful save
        eventPublisher.publishEvent(new BatchInventoryEvent(this, savedBatches));
        return savedBatches;
    }

    private BatchInventory convertToBatchInventory(PurchaseLineItemDTO dto) {
        Integer totalQuantity = dto.getQuantity() + dto.getFreeQuantity();
        //check if product exists
        ProductDTO productDTO= productService.getProductById(dto.getProductId());
        if(productDTO==null){
            throw new EntityNotFoundException("Product not found");
        }else{
            return BatchInventory.builder()
                    .productId(dto.getProductId())
                    .purchaseInvoiceNo(dto.getPurchaseInvoice())
                    .manufactureDate(dto.getManufactureDate())
                    .expiryDate(dto.getExpiryDate())
                    .purchasedUnitQuantity(dto.getQuantity())
                    .freeQuantity(dto.getFreeQuantity())
                    .availableUnitQuantity(totalQuantity) // Initially same as purchased
                    .wholesalePrice(dto.getUnitPrice())
                    .retailPrice(dto.getRetailPrice())
                    .discount(dto.getDiscountAmount())
                    .batchStatus(BatchStatus.AVAILABLE)
                    .dateReceived(LocalDate.now())
                    .build();
        }
    }

    /**
     * Event listener for BatchInventoryEvent.
     * Allocates newly created batches to the Main Warehouse.
     */
    @EventListener
    @Transactional
    public void allocateBatchesToMainWarehouse(BatchInventoryEvent batchInventoryEvent) {
        List<BatchInventory> createdBatches = batchInventoryEvent.getCreatedBatches();

        // Find the Main Warehouse
        InventoryLocation mainWarehouse = inventoryLocationRepo.findByLocationName("Main Warehouse")
                .orElseThrow(() -> new NotFoundException("Main Warehouse not found"));

        // Check and update available capacity
        int totalQuantityToAllocate = createdBatches.stream()
                .mapToInt(BatchInventory::getAvailableUnitQuantity)
                .sum();
        if (mainWarehouse.getAvailableCapacity() < totalQuantityToAllocate) {
            throw new IllegalStateException("Insufficient capacity in Main Warehouse. Required: " +
                    totalQuantityToAllocate +
                    ", Available: " + mainWarehouse.getAvailableCapacity());
        }
        // Create WarehouseInventory records for each batch
        List<WarehouseInventory> warehouseInventories = new ArrayList<>();
        for (BatchInventory batch : createdBatches) {
            WarehouseInventory warehouseInventory = WarehouseInventory.builder()
                    .location(mainWarehouse)
                    .batch(batch)
                    .quantity(batch.getAvailableUnitQuantity())
                    .warehouseLocation(mainWarehouse.getLocationName())
                    .build();
            warehouseInventories.add(warehouseInventory);
        }
        warehouseInventoryRepo.saveAll(warehouseInventories);
        // Update Main Warehouse available capacity
        mainWarehouse.setAvailableCapacity(mainWarehouse.getAvailableCapacity() - totalQuantityToAllocate);
        inventoryLocationRepo.save(mainWarehouse);
    }

    /**
     * Checks for batches nearing expiry and generates alerts for 6 months, 3 months, 1 month, and 1 week before expiry.
     * Returns a list of ExpiryAlertDTOs for batches needing alerts, grouped by product and sorted by earliest expiry date.
     *
     * @return List of ExpiryAlertDTOs containing product-based expiry alerts
     * @throws NotFoundException if a product associated with a batch is not found
     */
    @Override
    public List<ExpiryAlertDTO> checkExpiryAlerts() {
        LocalDate now = LocalDate.now();
        Map<Long, ExpiryAlertDTO> alertsByProduct = new HashMap<>();
        // Define timeframes for alerts in a LinkedHashMap to maintain insertion order
        // from most urgent to the least urgent
        Map<String, LocalDate> thresholds = new LinkedHashMap<>();
        thresholds.put("1 week before expiry", now.plusWeeks(1));
        thresholds.put("1 month before expiry", now.plusMonths(1));
        thresholds.put("3 months before expiry", now.plusMonths(3));
        thresholds.put("6 months before expiry", now.plusMonths(6));
        // Process all batches that will expire in the next 6 months
        List<BatchInventory> allExpiringBatches = batchInventoryRepo.findByExpiryDateBetween(now,
                now.plusMonths(6));
        // Group batches by product ID
        Map<Long, List<BatchInventory>> batchesByProduct = allExpiringBatches.stream()
                .filter(batch -> batch.getBatchStatus() != BatchStatus.EXPIRED &&
                        batch.getBatchStatus() != BatchStatus.SOLD)
                .collect(Collectors.groupingBy(BatchInventory::getProductId));
        // Process each product's batches
        for (Map.Entry<Long, List<BatchInventory>> entry : batchesByProduct.entrySet()) {
            Long productId = entry.getKey();
            List<BatchInventory> productBatches = entry.getValue();

            ProductDTO product = productService.getProductById(productId);
            if (product == null) {
                throw new NotFoundException("Product not found for ID: " + productId);
            }
            // Determine the most urgent alert level for this product
            String alertMessage = null;
            LocalDate earliestExpiry = null;

            for (BatchInventory batch : productBatches) {
                if (earliestExpiry == null || batch.getExpiryDate().isBefore(earliestExpiry)) {
                    earliestExpiry = batch.getExpiryDate();
                }
                // Determine the appropriate alert level for this batch
                for (Map.Entry<String, LocalDate> threshold : thresholds.entrySet()) {
                    if (batch.getExpiryDate().isBefore(threshold.getValue()) ||
                            batch.getExpiryDate().isEqual(threshold.getValue())) {
                        alertMessage = threshold.getKey();
                        break; // Found the most urgent applicable alert for this batch
                    }
                }
                if (alertMessage != null) {
                    break; // We found the most urgent alert level for this product
                }
            }
            // Create alert with the most urgent message
            ExpiryAlertDTO alert = ExpiryAlertDTO.builder()
                    .productId(productId)
                    .productName(product.getProductName())
                    .batches(productBatches.stream().map(batchInventoryMapper::toDTO).collect(Collectors.toList()))
                    .alertMessage(alertMessage)
                    .earliestExpiryDate(earliestExpiry)
                    .build();

            alertsByProduct.put(productId, alert);
        }
        // Convert map values to list and sort by earliest expiry date
        List<ExpiryAlertDTO> finalAlerts = new ArrayList<>(alertsByProduct.values());
        finalAlerts.sort(Comparator.comparing(ExpiryAlertDTO::getEarliestExpiryDate));

        return finalAlerts;
    }
    /**
     * Returns a summary of expiry alerts for batches nearing expiry.
     * Counts the number of alerts for each timeframe: 1 week, 1 month, 3 months, and 6 months before expiry.
     *
     * @return ExpiryCountDTO containing counts of expiry alerts for each timeframe
     */
    @Override
    public ExpiryCountDTO getExpiryCounts() {
        LocalDate now = LocalDate.now();
        // Define timeframes for alerts
        LocalDate oneWeekThreshold = now.plusWeeks(1);
        LocalDate oneMonthThreshold = now.plusMonths(1);
        LocalDate threeMonthsThreshold = now.plusMonths(3);
        LocalDate sixMonthsThreshold = now.plusMonths(6);

        // Get all non-expired, non-sold batches (including those beyond 6 months)
        List<BatchInventory> allActiveBatches = batchInventoryRepo.findAll()
                .stream()
                .filter(batch -> batch.getBatchStatus() != BatchStatus.EXPIRED &&
                        batch.getBatchStatus() != BatchStatus.SOLD)
                .collect(Collectors.toList());

        int oneWeekBatches = 0, oneWeekQuantity = 0;
        int oneMonthBatches = 0, oneMonthQuantity = 0;
        int threeMonthsBatches = 0, threeMonthsQuantity = 0;
        int sixMonthsBatches = 0, sixMonthsQuantity = 0;
        int safeBatches = 0, safeQuantity = 0; // For batches expiring beyond 6 months

        for (BatchInventory batch : allActiveBatches) {
            LocalDate expiryDate = batch.getExpiryDate();
            int quantity = batch.getAvailableUnitQuantity() != null ? batch.getAvailableUnitQuantity() : 0;

            if (expiryDate.isBefore(oneWeekThreshold) || expiryDate.isEqual(oneWeekThreshold)) {
                oneWeekBatches++;
                oneWeekQuantity += quantity;
            } else if (expiryDate.isBefore(oneMonthThreshold) || expiryDate.isEqual(oneMonthThreshold)) {
                oneMonthBatches++;
                oneMonthQuantity += quantity;
            } else if (expiryDate.isBefore(threeMonthsThreshold) || expiryDate.isEqual(threeMonthsThreshold)) {
                threeMonthsBatches++;
                threeMonthsQuantity += quantity;
            } else if (expiryDate.isBefore(sixMonthsThreshold) || expiryDate.isEqual(sixMonthsThreshold)) {
                sixMonthsBatches++;
                sixMonthsQuantity += quantity;
            } else {
                safeBatches++;
                safeQuantity += quantity;
            }
        }
        return ExpiryCountDTO.builder()
                .oneWeek(new int[]{oneWeekBatches, oneWeekQuantity})
                .oneMonth(new int[]{oneMonthBatches, oneMonthQuantity})
                .threeMonths(new int[]{threeMonthsBatches, threeMonthsQuantity})
                .sixMonths(new int[]{sixMonthsBatches, sixMonthsQuantity})
                .safeBatches(new int[]{safeBatches, safeQuantity}) // Add the new field
                .build();
    }
    //Method to retrieve available batches for a product sorted by expiry date (ascending)
    @Override
    public List<BatchInventoryDTO> getBatchesByProductIdSorted(Long productId) {
        List<BatchInventory> batches = batchInventoryRepo.findByProductId(productId)
                .stream()
                .filter(b -> b.getAvailableUnitQuantity() != null && b.getAvailableUnitQuantity() > 0)
                .sorted(Comparator.comparing(BatchInventory::getExpiryDate))
                .collect(Collectors.toList());
        return batchInventoryMapper.toDTOsList(batches);
    }

    /**
     * Method to set batch status to EXPIRED when the expiry date is reached.
     */
    @Scheduled(cron = "0 0 */6 * * ?") // Runs every 6 hours
    @Transactional
    public void updateExpiredBatches() {
        LocalDate today = LocalDate.now();
        // Find all batches that have expired but not marked as EXPIRED yet
        List<BatchInventory> expiredBatches = batchInventoryRepo.findByExpiryDateBeforeAndBatchStatusNot(
                today, BatchStatus.EXPIRED);

        if (!expiredBatches.isEmpty()) {
            expiredBatches.forEach(batch -> batch.setBatchStatus(BatchStatus.EXPIRED));
            batchInventoryRepo.saveAll(expiredBatches);

            logger.info("Updated {} batches to EXPIRED status", expiredBatches.size());
        }
    }
    //Method to check for expired batches on application startup
    @PostConstruct
    @Transactional
    public void checkExpiredBatchesOnStartup() {
        logger.info("Checking for expired batches on application startup");
        updateExpiredBatches();
    }

    private void checkAndUpdateBatchStatus(BatchInventory batch) {
        if (batch.getBatchStatus() != BatchStatus.EXPIRED &&
                batch.getExpiryDate().isBefore(LocalDate.now())) {
            batch.setBatchStatus(BatchStatus.EXPIRED);
            batchInventoryRepo.save(batch);
            logger.info("Updated batch {} to EXPIRED status during retrieval", batch.getBatchId());
        }
    }

    /**
     * Checks for products needing reorder based on total available quantity across batches compared to reorderLimitByPackage.
     * Returns a list of ReorderAlertDTOs for products requiring reorder alerts, grouped by product.
     *
     * @return List of ReorderAlertDTOs containing product-based reorder alerts
     * @throws NotFoundException if a product associated with a batch is not found
     */
    @Override
    public List<ReorderAlertDTO> checkReorderAlerts() {
        // Get distinct product IDs for AVAILABLE batches
        List<Long> productIds = batchInventoryRepo.findAll().stream()
                .filter(batch -> batch.getBatchStatus() == BatchStatus.AVAILABLE)
                .map(BatchInventory::getProductId)
                .distinct()
                .toList();

        List<ReorderAlertDTO> alerts = new ArrayList<>();
        for (Long productId : productIds) {
            Integer totalAvailable = batchInventoryRepo.sumAvailableUnitQuantityByProductIdAndStatus
                    (productId, BatchStatus.AVAILABLE);
            if (totalAvailable == null) totalAvailable = 0; // Handle case where no batches exist

            ProductDTO product = productService.getProductById(productId);
            if (product != null && totalAvailable <= product.getReorderLimitByPackage()) {
                // Get all AVAILABLE batches for this product
                List<BatchInventory> productBatches = batchInventoryRepo.findByProductIdAndStatus
                        (productId, BatchStatus.AVAILABLE);
                List<BatchInventoryDTO> batchDTOs = productBatches.stream()
                        .map(batchInventoryMapper::toDTO)
                        .toList();

                ReorderAlertDTO alert = ReorderAlertDTO.builder()
                        .productId(productId)
                        .productName(product.getProductName())
                        .totalAvailableQuantity(totalAvailable)
                        .reorderLimitByPackage(product.getReorderLimitByPackage())
                        .batches(batchDTOs)
                        .build();

                alerts.add(alert);
                System.out.println("Reorder Alert for Product " + productId + ": Total available = " + totalAvailable +
                        ", Reorder limit = " + product.getReorderLimitByPackage());
            }
        }
        // Sort alerts by totalAvailableQuantity (low to high) for prioritization
        alerts.sort(Comparator.comparing(ReorderAlertDTO::getTotalAvailableQuantity));
        return alerts;
    }
    /**
     * Method to get stock values for all products.
     * Retrieves all active products and their corresponding batch inventories.
     */
    @Override
    public StockCountDTO stockAvailability() {
        List<ProductCountDTO> activeProducts = productService.getProductsByStatus(ACTIVE);
        int availableStock = 0;
        int lowStock = 0;
        int outOfStock = 0;
        int totalStock = 0;

        List<ProductCountDTO> outOfStockProducts = new ArrayList<>();
        List<ProductCountDTO> lowStockProducts = new ArrayList<>();

        for (ProductCountDTO product : activeProducts) {
            // Get total available quantity directly using repository method
            Integer totalAvailableQuantity = batchInventoryRepo.sumAvailableUnitQuantityByProductIdAndStatus(
                    product.getProductId(), BatchStatus.AVAILABLE);

            if (totalAvailableQuantity == null) {
                totalAvailableQuantity = 0;
            }
            totalStock += totalAvailableQuantity;
            // Categorize product based on stock level
            if (totalAvailableQuantity == 0) {
                outOfStock++;
                outOfStockProducts.add(product);
            } else if (totalAvailableQuantity <= product.getReorderLimitByPackage()) {
                lowStock++;
                lowStockProducts.add(product);
            } else {
                availableStock++;
            }
        }
        return StockCountDTO.builder()
                .totalStock(totalStock)
                .availableStock(availableStock)
                .lowStock(lowStock)
                .outOfStock(outOfStock)
                .outOfStockProducts(outOfStockProducts)
                .lowStockProducts(lowStockProducts)
                .build();
    }

    //Deduct inventory for a product by reducing the available quantity in batches
    @Override
    public void deductInventory(Long productId, Integer quantity) {
        // Retrieve batches for the product (sorted by expiry date)
        List<BatchInventory> batches = batchInventoryRepo.findByProductId(productId)
                .stream()
                .filter(b -> b.getAvailableUnitQuantity() != null && b.getAvailableUnitQuantity() > 0)
                .sorted(Comparator.comparing(BatchInventory::getExpiryDate))
                .collect(Collectors.toList());

        int remaining = quantity;
        for (BatchInventory batch : batches) {
            if (remaining <= 0) break;
            int available = batch.getAvailableUnitQuantity();
            if (available >= remaining) {
                batch.setAvailableUnitQuantity(available - remaining);
                remaining = 0;
            } else {
                batch.setAvailableUnitQuantity(0);
                remaining -= available;
            }
            batchInventoryRepo.save(batch);
        }
        if (remaining > 0) {
            throw new RuntimeException("Not enough inventory to deduct " + quantity +
                    " units for product id " + productId);
        }
    }

}