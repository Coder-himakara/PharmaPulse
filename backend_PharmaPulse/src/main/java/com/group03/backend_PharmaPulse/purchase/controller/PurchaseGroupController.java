package com.group03.backend_PharmaPulse.purchase.controller;

import com.group03.backend_PharmaPulse.purchase.dto.PurchaseGroupDTO;
import com.group03.backend_PharmaPulse.purchase.service.PurchaseGroupService;
import com.group03.backend_PharmaPulse.util.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/purchase-group")
public class PurchaseGroupController {
    private PurchaseGroupService purchaseGroupService;
    public PurchaseGroupController(PurchaseGroupService purchaseGroupService) {
        this.purchaseGroupService = purchaseGroupService;
    }

    // This method is used to retrieve all purchase groups
    @GetMapping("/all")
    public ResponseEntity<StandardResponse> getAllPurchaseGroups() {
        List<PurchaseGroupDTO> purchaseGroupDTOS  = purchaseGroupService.getAllPurchaseGroups();
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Success",purchaseGroupDTOS+"Retrived all purchase groups"),
                HttpStatus.CREATED
        );
    }

    // This method is used to retrieve a purchase group by its id
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getPurchaseGroupsById(@PathVariable int id) {
        String message = purchaseGroupService.getPurchaseGroupById(id).toString();
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Success",message+"Retrived all purchase groups"),
                HttpStatus.CREATED
        );
    }
}
