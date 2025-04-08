package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.TruckService;
import com.group03.backend_PharmaPulse.inventory.api.dto.InventoryLocationDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.TruckDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.TruckResponseDTO;
import com.group03.backend_PharmaPulse.inventory.api.enumeration.LocationType;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Truck;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.TruckMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.TruckRepo;
import com.group03.backend_PharmaPulse.inventory.internal.repository.WarehouseInventoryRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TruckServiceIMPL implements TruckService {

    private final TruckRepo truckRepository;
    private final InventoryLocationServiceImpl inventoryLocationServiceImpl;
    private final TruckMapper truckMapper;

    public TruckServiceIMPL (TruckRepo truckRepository,InventoryLocationServiceImpl inventoryLocationServiceImpl,
                             TruckMapper truckMapper) {
        this.truckRepository = truckRepository;
        this.inventoryLocationServiceImpl = inventoryLocationServiceImpl;
        this.truckMapper = truckMapper;
    }

    @Override
    @Transactional
    public TruckDTO createTruck(TruckDTO truckDTO) {
        try {
            // Validate input data
            if (truckDTO == null) {
                throw new IllegalArgumentException("Truck data cannot be null");
            }
            if (truckDTO.getRegistrationNumber() == null || truckDTO.getRegistrationNumber().trim().isEmpty()) {
                throw new IllegalArgumentException("Registration number cannot be empty");
            }
            if (truckDTO.getMaxCapacity() == null || truckDTO.getMaxCapacity() <= 0) {
                throw new IllegalArgumentException("Maximum capacity must be a positive number");
            }
            // Check if truck already exists
            if (truckRepository.existsByRegistrationNumberIgnoreCase(truckDTO.getRegistrationNumber())) {
                throw new IllegalArgumentException("Truck with registration number " +
                        truckDTO.getRegistrationNumber() + " already exists");
            }

            Truck truck = truckMapper.toEntity(truckDTO);
            truck.setCurrentCapacity(0); // Initialize current capacity to 0
            Truck savedTruck = truckRepository.save(truck);
            // Create inventory location for the truck
            createTruckInventoryLocation(truckDTO);
            return truckMapper.toDTO(savedTruck);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create truck: " + e.getMessage(), e);
        }
    }

    /**
     * Creates an inventory location for a truck
     * @param truckDTO The truck data transfer object
     * @throws RuntimeException if inventory location creation fails
     */
    private void createTruckInventoryLocation(TruckDTO truckDTO) {
        try {
            InventoryLocationDTO inventoryLocationDTO = new InventoryLocationDTO();
            inventoryLocationDTO.setLocationType(LocationType.TRUCK);
            inventoryLocationDTO.setLocationName(truckDTO.getRegistrationNumber());
            inventoryLocationDTO.setTotalCapacity(truckDTO.getMaxCapacity());
            inventoryLocationDTO.setAvailableCapacity(truckDTO.getMaxCapacity());
            inventoryLocationServiceImpl.addInventoryLocation(inventoryLocationDTO);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create inventory location for truck: " + e.getMessage(), e);
        }
    }

    @Override
    public double checkAvailableSpace(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
        return truck.getMaxCapacity() - truck.getCurrentCapacity();
    }

    @Override
    public void updateTruckCapacity(Integer quantity, Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new RuntimeException("Truck not found"));
        if(truck.getMaxCapacity() - truck.getCurrentCapacity() < quantity) {
            throw new IllegalArgumentException("Truck capacity exceeded");
        }
        truck.setCurrentCapacity(truck.getCurrentCapacity() + quantity);
        truckRepository.save(truck);
    }

    @Override
    public List<TruckResponseDTO> getAllTrucks() {
        List<Truck> trucks = truckRepository.findAll();
        if (!trucks.isEmpty()) {
            return truckMapper.toResponseDTOList(trucks);
        }else{
            throw new NotFoundException("No trucks found");
        }
    }

    @Override
    public TruckResponseDTO getTruckById(Long truckId) {
        Truck truck = truckRepository.findById(truckId)
                .orElseThrow(() -> new NotFoundException("Truck not found"));
        return truckMapper.toResponseDTO(truck);
    }

    @Override
    @Transactional
    public TruckResponseDTO updateTruck(Long truckId, TruckResponseDTO truckDTO) {
        Truck existingTruck = truckRepository.findById(truckId)
                .orElseThrow(() -> new NotFoundException("Truck not found"));

        String oldRegistrationNumber = existingTruck.getRegistrationNumber();
        String newRegistrationNumber = truckDTO.getRegistrationNumber();

        // Check if registration is changing and already exists elsewhere
        if (!oldRegistrationNumber.equalsIgnoreCase(newRegistrationNumber) &&
                truckRepository.existsByRegistrationNumberIgnoreCase(newRegistrationNumber)) {
            throw new IllegalArgumentException("Truck with registration number " +
                    newRegistrationNumber + " already exists");
        }

        // Update truck entity
        Truck updatedTruck = truckMapper.toEntityFromResponse(truckDTO);
        updatedTruck.setId(truckId);
        // Check if the new max capacity is less than the current capacity
        if (updatedTruck.getMaxCapacity() < existingTruck.getCurrentCapacity()) {
            throw new IllegalArgumentException("Cannot reduce maximum capacity below current load level");
        }
        updatedTruck.setCurrentCapacity(existingTruck.getCurrentCapacity());
        Truck savedTruck = truckRepository.save(updatedTruck);
        // Update inventory location using the specialized method
        inventoryLocationServiceImpl.updateTruckLocation(
                oldRegistrationNumber, newRegistrationNumber, truckDTO.getMaxCapacity());

        return truckMapper.toResponseDTO(savedTruck);
    }

    @Service
    public static class StockTransferServiceImpl {
        private final TruckRepo truckRepo;
        private final WarehouseInventoryRepo warehouseInventoryRepo;

        public StockTransferServiceImpl(TruckRepo truckRepo, WarehouseInventoryRepo warehouseInventoryRepo) {
            this.truckRepo = truckRepo;
            this.warehouseInventoryRepo = warehouseInventoryRepo;
        }
    }
}
