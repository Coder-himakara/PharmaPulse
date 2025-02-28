package com.group03.backend_PharmaPulse.user.internal.serviceImpl;

import com.group03.backend_PharmaPulse.user.internal.entity.UserPrincipal;
import com.group03.backend_PharmaPulse.user.internal.entity.Users;
import com.group03.backend_PharmaPulse.user.internal.repository.UsersRepo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {
    private final UsersRepo usersRepo;
    public AppUserDetailsService(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    @Override
    @Cacheable("users")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepo.findByUsername(username);
        if(user==null){
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }
        return new UserPrincipal(user);
    }

}
