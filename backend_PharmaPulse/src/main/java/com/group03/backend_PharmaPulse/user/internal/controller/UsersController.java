package com.group03.backend_PharmaPulse.user.internal.controller;

import com.group03.backend_PharmaPulse.user.api.UsersService;
import com.group03.backend_PharmaPulse.user.api.dto.UserLoginDTO;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/register")
    public ResponseEntity<StandardResponse> registerUser(@RequestPart UsersDTO usersDTO,
                                                         @RequestPart MultipartFile imageFile) {
        try{
            UsersDTO savedUser = usersService.registerUser(usersDTO,imageFile);
            return new ResponseEntity<>(
                    new StandardResponse(201,"Success",savedUser),
                    HttpStatus.CREATED
            );
        }catch(Exception e){
            return new ResponseEntity<>(
                    new StandardResponse(400,"Error",null),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<StandardResponse> loginUser(@RequestBody UserLoginDTO userLoginDTO) {
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",usersService.verify(userLoginDTO)),
                HttpStatus.OK
        );
    }
}
