package com.ZenTask.ZenTask.Controllers;

import com.ZenTask.ZenTask.Entities.AppUser;
import com.ZenTask.ZenTask.services.TokenService;
import com.ZenTask.ZenTask.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/api/auth/register")
    private ResponseEntity<?> createUser(@RequestBody AppUser user){
        AppUser newUser = userService.createProfile(user);
        return ResponseEntity.ok(Map.of("message", "User Registered Successfully"));
    }

    @GetMapping("/api/user/profile")
    private ResponseEntity<?> getUser(@RequestHeader("Authorization") String authorizationHeader) {
        // 1. Extract the token from the header
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring(7); // remove "Bearer "

        // 2. Validate and extract the user identifier
        Optional<String> userIdentifierOptional = tokenService.extractUserIdentifier(token);

        if (userIdentifierOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3. Find user by email (or id)
        String email = userIdentifierOptional.get();
        Optional<AppUser> userOptional = userService.findByEmail(email);

        // 4. Return user if found
        return userOptional.map(user ->
                ResponseEntity.ok(Map.of("id", user.getId(), "name", user.getUsername(), "email", user.getEmail()))
        ).orElseGet(() -> ResponseEntity.notFound().build());
    }

}
