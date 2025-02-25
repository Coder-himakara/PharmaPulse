package com.group03.backend_PharmaPulse.user.internal.serviceImpl;

import com.group03.backend_PharmaPulse.user.api.UsersService;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import com.group03.backend_PharmaPulse.user.internal.entity.Users;
import com.group03.backend_PharmaPulse.user.internal.mapper.UsersMapper;
import com.group03.backend_PharmaPulse.user.internal.repository.UsersRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsersServiceImpl implements UsersService {
    private final UsersRepo usersRepo;
    private final PasswordEncoder passwordEncoder;
    private final UsersMapper usersMapper;

    public UsersServiceImpl(UsersRepo usersRepo, PasswordEncoder passwordEncoder,
                            UsersMapper usersMapper) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
        this.usersMapper = usersMapper;
    }

    public UsersDTO registerUser(UsersDTO usersDTO) {
        usersDTO.setPassword(passwordEncoder.encode(usersDTO.getPassword()));
        Users registeredUser = usersRepo.save(usersMapper.toEntity(usersDTO));
        return usersMapper.toDTO(registeredUser);
    }
}
