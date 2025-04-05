package com.group03.backend_PharmaPulse.inventory.internal.serviceImpl;

import com.group03.backend_PharmaPulse.inventory.api.TruckInventoryService;
import com.group03.backend_PharmaPulse.inventory.api.dto.TruckInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.TruckInventory;
import com.group03.backend_PharmaPulse.inventory.internal.mapper.TruckInventoryMapper;
import com.group03.backend_PharmaPulse.inventory.internal.repository.TruckInventoryRepo;
import com.group03.backend_PharmaPulse.util.api.exception.NotFoundException;
import org.springframework.stereotype.Service;



@Service
public class TruckInventoryServiceImpl implements TruckInventoryService {

    private final TruckInventoryRepo truckInventoryRepo;
    private final TruckInventoryMapper truckInventoryMapper;


     public TruckInventoryServiceImpl(TruckInventoryRepo truckInventoryRepo,TruckInventoryMapper truckInventoryMapper) {
         this.truckInventoryRepo = truckInventoryRepo;
         this.truckInventoryMapper = truckInventoryMapper;
     }

    @Override
    public TruckInventoryDTO addOrUpdateTruckInventory(TruckInventoryDTO truckInventoryDTO) {
        try {
            // Check if inventory already exists
            TruckInventory existingInventory = null;
            try {
                existingInventory = truckInventoryRepo
                        .findByBatchIdAndLocationId(
                                truckInventoryDTO.getBatch(),
                                truckInventoryDTO.getLocation()
                        ).orElse(null);
            } catch (Exception e) {
                // If exception occurs during lookup, continue with creation
            }

            if (existingInventory != null) {
                // Update existing inventory by adding the new quantity to the existing one
                int updatedQuantity = existingInventory.getQuantity() + truckInventoryDTO.getQuantity();
                existingInventory.setQuantity(updatedQuantity);

                // Update registration number if provided
                if (truckInventoryDTO.getRegistrationNumber() != null) {
                    existingInventory.setRegistrationNumber(truckInventoryDTO.getRegistrationNumber());
                }

                TruckInventory savedInventory = truckInventoryRepo.save(existingInventory);
                return truckInventoryMapper.toDTO(savedInventory);
            } else {
                // Create new inventory
                TruckInventory newInventory = truckInventoryMapper.toEntity(truckInventoryDTO);
                TruckInventory savedInventory = truckInventoryRepo.save(newInventory);
                return truckInventoryMapper.toDTO(savedInventory);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to add or update truck inventory", e);
        }
    }

    @Override
    public TruckInventoryDTO getTruckInventoryByBatchAndLocation(Long batchNumber, Long locationId) {
        try {
            return truckInventoryRepo.findByBatchIdAndLocationId(batchNumber, locationId)
                    .map(truckInventoryMapper::toDTO)
                    .orElseThrow(() -> new NotFoundException(
                            "Truck inventory not found for batch " + batchNumber + " at location " + locationId));
        } catch (Exception e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new RuntimeException("Error retrieving truck inventory", e);
        }
    }
}
