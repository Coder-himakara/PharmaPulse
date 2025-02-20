package com.group03.backend_PharmaPulse.inventory.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.TruckService;
import com.group03.backend_PharmaPulse.inventory.internal.entity.Truck;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/trucks")
public class TruckController {
    @Autowired
    private TruckService truckService;

    public TruckController(TruckService truckService) {
        this.truckService = truckService;
    }

    @PostMapping("/")
    public ResponseEntity<?> addTruck(@RequestBody Truck truck) {
        Truck createdTruck = truckService.createTruck(truck);
        return new ResponseEntity<>(
                new StandardResponse(201, "Success", createdTruck),
                HttpStatus.OK
        );
    }

    @GetMapping("/{truckId}/available-space")
    public ResponseEntity<?> getAvailableSpace(@PathVariable Long truckId) {
        double availableSpace = truckService.checkAvailableSpace(truckId);
        return new ResponseEntity<>(
                new StandardResponse(201, "Success", availableSpace),
                HttpStatus.OK
        );
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllTrucks() {
        List<Truck> trucks = truckService.getAllTrucks();
        return new ResponseEntity<>(
                new StandardResponse(201, "Success", trucks),
                HttpStatus.OK
        );
    }

    @GetMapping("/{truckId}")
    public ResponseEntity<?> getTruckById(@PathVariable Long truckId) {
        Truck truck = truckService.getTruckById(truckId);
        return new ResponseEntity<>(
                new StandardResponse(201, "Success", truck),
                HttpStatus.OK
        );
    }

}
