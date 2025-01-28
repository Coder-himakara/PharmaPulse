package com.group03.backend_PharmaPulse.purchase.controller;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseGroupService;
import com.group03.backend_PharmaPulse.util.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchase-groups")
public class PurchaseGroupController {
    private final PurchaseGroupService purchaseGroupService;
    public PurchaseGroupController(PurchaseGroupService purchaseGroupService) {
        this.purchaseGroupService = purchaseGroupService;
    }
    // This method is used to retrieve all purchase groups
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllPurchaseGroups() {
        List<PurchaseGroupDTO> purchaseGroupDTOS  = purchaseGroupService.getAllPurchaseGroups();
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",purchaseGroupDTOS),
                HttpStatus.OK
        );
    }
    // This method is used to retrieve a purchase group by its id
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getPurchaseGroupsById(@PathVariable int id) {
        PurchaseGroupDTO selectedPurchaseGroup = purchaseGroupService.getPurchaseGroupById(id);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",selectedPurchaseGroup),
                HttpStatus.FOUND
        );
    }
    // This method is used to add a purchase group
    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addPurchaseGroups(@Valid
                                                                 @RequestBody PurchaseGroupDTO purchaseGroupDTO) {
        PurchaseGroupDTO savedPurchaseGroup=purchaseGroupService.addPurchaseGroup(purchaseGroupDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedPurchaseGroup),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StandardResponse> updatePurchaseGroups(@Valid @PathVariable int id,
                                                                @RequestBody PurchaseGroupDTO purchaseGroupDTO) {
        PurchaseGroupDTO updatedPurchaseGroup=purchaseGroupService.updatePurchaseGroup(id,purchaseGroupDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",updatedPurchaseGroup),
                HttpStatus.CREATED
        );

    }

}
