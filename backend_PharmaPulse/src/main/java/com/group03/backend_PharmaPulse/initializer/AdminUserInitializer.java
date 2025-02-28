package com.group03.backend_PharmaPulse.initializer;

import com.group03.backend_PharmaPulse.user.api.UsersService;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import static com.group03.backend_PharmaPulse.user.api.enumeration.Role.ADMIN;


@Component
public class AdminUserInitializer implements CommandLineRunner {
    private final UsersService usersService;

    public AdminUserInitializer(UsersService usersService) {
        this.usersService = usersService;

    }

    @Override
    public void run(String... args) throws Exception {
        try{
            UsersDTO admin = new UsersDTO();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setRole(ADMIN);
            usersService.registerUser(admin);
        }catch(IllegalArgumentException ex){
            System.out.println("Admin and User already exist");
        }

    }
}
