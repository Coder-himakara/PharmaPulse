package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.internal.entity.Truck;

import java.util.List;

public interface TruckService {
    Truck createTruck(Truck truck);
    double checkAvailableSpace(Long truckId);
    List<Truck> getAllTrucks();
    Truck getTruckById(Long truckId);
}
