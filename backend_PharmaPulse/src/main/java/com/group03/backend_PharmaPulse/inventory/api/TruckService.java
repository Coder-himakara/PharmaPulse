package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.TruckDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.TruckResponseDTO;
import java.util.List;

public interface TruckService {
    TruckDTO createTruck(TruckDTO truckDTO);
    List<TruckResponseDTO>  getAllTrucks();
    TruckResponseDTO getTruckById(Long truckId);
    TruckDTO updateTruck(Long truckId, TruckDTO truckDTO);
    double checkAvailableSpace(Long truckId);
    void updateTruckCapacity(Integer quantity, Long truckId);
}
