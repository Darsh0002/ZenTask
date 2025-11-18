package com.ZenTask.ZenTask.services;

import com.ZenTask.ZenTask.Entities.AppUser;
import com.ZenTask.ZenTask.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AppUser createProfile(AppUser user) throws ResponseStatusException{
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email Already Exists");
        }
        // ✅ Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepo.save(user);
    }

    public Optional<AppUser> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}
