package com.group03.backend_PharmaPulse.purchase.internal.controller;

import com.group03.backend_PharmaPulse.purchase.api.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.api.PurchaseGroupService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/purchase-groups")
@PreAuthorize("hasRole('EMPLOYEE')")
public class PurchaseGroupController {
    private final PurchaseGroupService purchaseGroupService;
    public PurchaseGroupController(PurchaseGroupService purchaseGroupService) {
        this.purchaseGroupService = purchaseGroupService;
    }
    // This method is used to retrieve all purchase groups
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getAllPurchaseGroups() {
        List<PurchaseGroupDTO> purchaseGroupDTOS  = purchaseGroupService.getAllPurchaseGroups();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",purchaseGroupDTOS),
                HttpStatus.OK
        );
    }
    // This method is used to retrieve a purchase group by its id
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getPurchaseGroupsById(@PathVariable Long id) {
        PurchaseGroupDTO selectedPurchaseGroup = purchaseGroupService.getPurchaseGroupById(id);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",selectedPurchaseGroup),
                HttpStatus.OK
        );
    }
    // This method is used to add a purchase group
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('employee:create')")
    public ResponseEntity<StandardResponse> addPurchaseGroups(@Valid
                                                                 @RequestBody PurchaseGroupDTO purchaseGroupDTO) {
        PurchaseGroupDTO savedPurchaseGroup=purchaseGroupService.addPurchaseGroup(purchaseGroupDTO);
        return new ResponseEntity<>(
                new StandardResponse(201,"Success",savedPurchaseGroup),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('employee:update')")
    public ResponseEntity<StandardResponse> updatePurchaseGroups(@Valid @PathVariable Long id,
                                                                @RequestBody PurchaseGroupDTO purchaseGroupDTO) {
        PurchaseGroupDTO updatedPurchaseGroup=purchaseGroupService.updatePurchaseGroup(id,purchaseGroupDTO);
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",updatedPurchaseGroup),
                HttpStatus.CREATED
        );
    }
}
