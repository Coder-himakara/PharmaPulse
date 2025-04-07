package com.group03.backend_PharmaPulse.report.internal.controller;

import com.group03.backend_PharmaPulse.inventory.api.dto.response.StockCountDTO;
import com.group03.backend_PharmaPulse.report.api.EmployeeDashBoardService;
import com.group03.backend_PharmaPulse.report.api.dto.EmployeeDashBoardCountsDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/employee/dashboard")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeDashBoardController {
    private final EmployeeDashBoardService employeeDashBoardService;

    public EmployeeDashBoardController(EmployeeDashBoardService employeeDashBoardService) {
        this.employeeDashBoardService = employeeDashBoardService;
    }

    @GetMapping("/counts")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<StandardResponse> getEmployeeDashBoardCounts() {
        EmployeeDashBoardCountsDTO employeeDashBoardCounts = employeeDashBoardService.getEmployeeDashBoardCounts();
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",employeeDashBoardCounts),
                HttpStatus.OK
        );
    }

    @MessageMapping("/counts")
    @SendTo("/topic/employee/dashboard/counts")
    public EmployeeDashBoardCountsDTO getEmployeeDashBoardCountsWs() {
        return employeeDashBoardService.getEmployeeDashBoardCounts();
    }
}
