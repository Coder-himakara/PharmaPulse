package com.group03.backend_PharmaPulse.purchase.controller;

import com.group03.backend_PharmaPulse.purchase.service.PurchaseGroupService;
import com.group03.backend_PharmaPulse.util.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        String message = "Successfully ";
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Success",message+"Retrived all purchase groups"),
                HttpStatus.CREATED
        );
    }
//    @GetMapping("/all")
//    public String getAllPurchaseGroups() {
//        String message = "Successfully ";
//        return message+"Retrived all purchase groups";
//    }
}
