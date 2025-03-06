package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.InventoryReservationService;
import com.group03.backend_PharmaPulse.inventory.api.dto.ProductAvailabilityDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryReservation;
import com.group03.backend_PharmaPulse.inventory.internal.repository.BatchInventoryRepo;
import com.group03.backend_PharmaPulse.inventory.internal.repository.InventoryReservationRepo;
import com.group03.backend_PharmaPulse.product.api.ProductService;
import com.group03.backend_PharmaPulse.product.api.dto.ProductDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryReservationServiceImpl implements InventoryReservationService {

    private final InventoryReservationRepo reservationRepo;
    private final BatchInventoryRepo batchInventoryRepository;
    private final ProductService productService;
    private final InventoryReservationRepo inventoryReservationRepo;


    public InventoryReservationServiceImpl(InventoryReservationRepo reservationRepo, BatchInventoryRepo batchInventoryRepository, ProductService productService, InventoryReservationRepo inventoryReservationRepo) {
        this.reservationRepo = reservationRepo;
        this.batchInventoryRepository = batchInventoryRepository;
        this.productService = productService;
        this.inventoryReservationRepo = inventoryReservationRepo;
    }

    @Override
    @Transactional
    public void reserveInventory(Long productId, Integer quantity, Long orderId) {
        InventoryReservation reservation = InventoryReservation.builder()
                .productId(productId)
                .reservedQuantity(quantity)
                .orderId(orderId)
                .reservationTime(LocalDateTime.now())
                .build();
        reservationRepo.save(reservation);
    }

    @Override
    public Integer getTotalReservedForProduct(Long productId) {
        List<InventoryReservation> reservations = reservationRepo.findByProductId(productId);
        return reservations.stream().mapToInt(InventoryReservation::getReservedQuantity).sum();
    }

    @Override
    @Transactional
    public void finalizeReservation(Long productId, Integer quantity, Long orderId) {
        // For simplicity, delete all reservations for this order and product.
        // In a refined implementation, you might adjust the reserved quantities.
        List<InventoryReservation> reservations = reservationRepo.findByOrderId(orderId);
        for (InventoryReservation res : reservations) {
            if (res.getProductId().equals(productId)) {
                reservationRepo.delete(res);
            }
        }
    }
    //new method
    public int getAvailableQuantityByProductId(Long productId) {
        List<BatchInventory> batches = batchInventoryRepository.findByProductId(productId);
        int totalStock = batches.stream()
                .mapToInt(BatchInventory::getAvailableUnitQuantity)
                .sum();
        int totalReserved = reservationRepo.findByProductId(productId)
                .stream()
                .mapToInt(reservation -> reservation.getReservedQuantity())
                .sum();
        return totalStock - totalReserved;
    }

    /**
     * Returns a list of ProductAvailabilityDTO for all distinct products.
     */
    public List<ProductAvailabilityDTO> getAllProductAvailabilities() {
        List<Long> productIds = batchInventoryRepository.findDistinctProductIds();
        return productIds.stream()
                .map(pid -> {
                    // Use ProductService to get product details (like productName)
                    ProductDTO productDTO = productService.getProductById(pid);
                    String productName = productDTO != null ? productDTO.getProductName() : "Unknown Product";
                    int availableQuantity = getAvailableQuantityByProductId(pid);
                    return new ProductAvailabilityDTO(pid, productName, availableQuantity);
                })
                .collect(Collectors.toList());
    }

    // For demonstration purposes, assume each BatchInventory record contains the same product name.
    @Override
    @Transactional
    public void deleteReservationsByOrderId(Long orderId) {
        // Assuming your InventoryReservationRepository has a method to delete by orderId:
        inventoryReservationRepo.deleteByOrderId(orderId);
    }
}
