package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.TruckService;
import com.group03.backend_PharmaPulse.inventory.api.dto.TruckDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.response.TruckResponseDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/trucks")
public class TruckController {
    private final TruckService truckService;

    public TruckController(TruckService truckService) {
        this.truckService = truckService;
    }

    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addTruck(@RequestBody TruckDTO truckDTO) {
        TruckDTO createdTruck = truckService.createTruck(truckDTO);
        return new ResponseEntity<>(
                new StandardResponse(201, "Success", createdTruck),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{truckId}/available-space")
    public ResponseEntity<StandardResponse> getAvailableSpace(@PathVariable Long truckId) {
        double availableSpace = truckService.checkAvailableSpace(truckId);
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", availableSpace),
                HttpStatus.OK
        );
    }

    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllTrucks() {
        List<TruckResponseDTO> trucks = truckService.getAllTrucks();
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", trucks),
                HttpStatus.OK
        );
    }

    @GetMapping("/{truckId}")
    public ResponseEntity<StandardResponse> getTruckById(@PathVariable Long truckId) {
        TruckResponseDTO truck = truckService.getTruckById(truckId);
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", truck),
                HttpStatus.OK
        );
    }

    @PutMapping("/update/{truckId}")
    public ResponseEntity<StandardResponse> updateTruck(@PathVariable Long truckId, @RequestBody TruckDTO truckDTO) {
        TruckDTO updatedTruck = truckService.updateTruck(truckId, truckDTO);
        return new ResponseEntity<>(
                new StandardResponse(201, "Success", updatedTruck),
                HttpStatus.CREATED
        );
    }
}
