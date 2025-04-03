package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.InventoryLocationService;
import com.group03.backend_PharmaPulse.inventory.api.dto.InventoryLocationDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.InventoryLocationResponse;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.InventoryLocationMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.InventoryLocationRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryLocationServiceImpl implements InventoryLocationService {
    private final InventoryLocationRepo inventoryLocationRepo;
    private final InventoryLocationMapper inventoryLocationMapper;

    public InventoryLocationServiceImpl(InventoryLocationRepo inventoryLocationRepo,
                                        InventoryLocationMapper inventoryLocationMapper){
        this.inventoryLocationRepo=inventoryLocationRepo;
        this.inventoryLocationMapper=inventoryLocationMapper;
    }

    @Override
    public InventoryLocationResponse addInventoryLocation(InventoryLocationDTO inventoryLocationDTO) {
        if (inventoryLocationRepo.existsByLocationName(inventoryLocationDTO.getLocationName())) {
            throw new IllegalArgumentException("Inventory Location already exists");
        }
            InventoryLocation savedInventoryLocation = inventoryLocationRepo.
                    save(inventoryLocationMapper.toEntity(inventoryLocationDTO));
            return inventoryLocationMapper.toResponseDTO(savedInventoryLocation);
    }

    @Override
    public InventoryLocationResponse getInventoryLocationById(Long id) {
        Optional<InventoryLocation> inventoryLocation = inventoryLocationRepo.findById(id);
        return inventoryLocation.map(inventoryLocationMapper::toResponseDTO)
                .orElseThrow(() -> new NotFoundException("Inventory Location not found"));
    }

    @Override
    public List<InventoryLocationResponse> getAllInventoryLocations() {
       List<InventoryLocation> inventoryLocations = inventoryLocationRepo.findAll();
       if (!inventoryLocations.isEmpty()) {
           return inventoryLocationMapper.toResponseDTOsList(inventoryLocations);
       }else{
              throw new NotFoundException("No Inventory Locations found");
       }
    }

    /**
     * Updates inventory location when a truck's registration number changes
     */
    @Transactional
    public void updateTruckLocation(
            String oldRegistrationNumber, String newRegistrationNumber, Integer totalCapacity) {

        InventoryLocation location = inventoryLocationRepo.findByLocationName(oldRegistrationNumber)
                .orElseThrow(() -> new NotFoundException(
                        "Inventory Location not found for truck: " + oldRegistrationNumber));

        // Check if the new name already exists (except for this location)
        if (!oldRegistrationNumber.equals(newRegistrationNumber) &&
                inventoryLocationRepo.existsByLocationName(newRegistrationNumber)) {
            throw new IllegalArgumentException(
                    "Location with name " + newRegistrationNumber + " already exists");
        }
        // Calculate available capacity change
        int capacityDifference = totalCapacity - location.getTotalCapacity();
        int newAvailableCapacity = location.getAvailableCapacity() + capacityDifference;
        // Check if the new capacity is sufficient
        if (newAvailableCapacity < 0) {
            throw new IllegalArgumentException(
                    "Cannot reduce capacity to " + totalCapacity +
                            ". Current usage: " + (location.getTotalCapacity() - location.getAvailableCapacity()));
        }
        // Update location details
        location.setLocationName(newRegistrationNumber);
        location.setTotalCapacity(totalCapacity);
        location.setAvailableCapacity(newAvailableCapacity);
        inventoryLocationRepo.save(location);
    }
}
