package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.TruckService;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.TruckStatus;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Truck;
import com.group03.backend_PharmaPulse.inventory.internal.repository.TruckRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TruckServiceIMPL implements TruckService {

    @Autowired
    private TruckRepo truckRepository;
    @Override
    public Truck createTruck(Truck truck) {
        truck.setStatus(TruckStatus.ACTIVE);
        return truckRepository.save(truck);
    }

    @Override
    public double checkAvailableSpace(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
        return truck.getMaxCapacity() - truck.getCurrentCapacity();
    }

    @Override
    public List<Truck> getAllTrucks() {
        return truckRepository.findAll();
    }

    @Override
    public Truck getTruckById(Long truckId) {
        return truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
    }
}
