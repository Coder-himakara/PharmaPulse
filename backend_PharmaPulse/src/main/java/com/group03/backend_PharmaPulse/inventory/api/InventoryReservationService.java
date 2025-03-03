package com.group03.backend_PharmaPulse.inventory.api;

public interface InventoryReservationService {
    void reserveInventory(Long productId, Integer quantity, Long orderId);
    Integer getTotalReservedForProduct(Long productId);
    void finalizeReservation(Long productId, Integer quantity, Long orderId);
    // NEW: Delete reservation records for a given order id
    void deleteReservationsByOrderId(Long orderId);

}
