package com.caido.iqtest.Services;

import com.caido.iqtest.entity.Users;
import com.caido.iqtest.repositories.UsersRepository;
import com.caido.iqtest.util.JWT;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
    private final UsersRepository usersRepo;
    private final PasswordEncoder passwordEncoder;

    public UsersService(UsersRepository usersRepo, PasswordEncoder passwordEncoder) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public Users findByEmail(String email) {
        return usersRepo.findByEmail(email);
    }

    public Users save(Users u) {
        System.out.println("u.getPassword() "+u.getPasswordReal());
        String hashPwd = passwordEncoder.encode(u.getPasswordReal());
        u.setPassword(hashPwd);
        return usersRepo.save(u);
    }

    public Optional<Users> findById(Long id, String jwtConnectedUser) throws Exception{
        String idUserConectat = JWT.getClaimByNameFromToken(jwtConnectedUser, "id");
        if(!idUserConectat.equals(id+"")) {
            throw new RuntimeException("Tentativa de extragere date cu carcater personal a fost identificata, datele au fost inregistrate");
        }
        return usersRepo.findById(id);
    }
    
}
