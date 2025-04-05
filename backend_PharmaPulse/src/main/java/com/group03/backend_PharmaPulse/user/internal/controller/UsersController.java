package com.group03.backend_PharmaPulse.user.internal.controller;

import com.group03.backend_PharmaPulse.user.api.UsersService;
import com.group03.backend_PharmaPulse.user.api.dto.UserLoginDTO;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/users")
public class UsersController {
    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<StandardResponse> registerUser(
            @ModelAttribute UsersDTO usersDTO,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        UsersDTO savedUser;
        try {
            savedUser = usersService.registerUser(usersDTO, imageFile);

            return new ResponseEntity<>(
                    new StandardResponse(201, "Success", savedUser),
                    HttpStatus.CREATED
            );
        } catch (Exception e) {
            logger.error("Error registering user: ", e);
            return new ResponseEntity<>(
                    new StandardResponse(400, "Error: " + e.getMessage(), null),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<StandardResponse> loginUser(@RequestBody UserLoginDTO userLoginDTO,
                                                      HttpServletResponse response) {
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",usersService.verify(userLoginDTO,response)),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAuthority('admin:read')")
    @GetMapping("/details")
    public ResponseEntity<StandardResponse> getUserDetails() {
        return new ResponseEntity<>(
                new StandardResponse(200, "Success", usersService.getUserDetails()),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAuthority('admin:update')")
    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<StandardResponse> updateUser(
            @PathVariable Long id,
            @ModelAttribute UsersDTO usersDTO,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        try {
            UsersDTO updatedUser = usersService.updateUser(id, usersDTO, imageFile);
            return new ResponseEntity<>(
                    new StandardResponse(200, "Success", updatedUser),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            logger.error("Error updating user: ", e);
            return new ResponseEntity<>(
                    new StandardResponse(400, "Error: " + e.getMessage(), null),
                    HttpStatus.BAD_REQUEST
            );
        }
    }
}
