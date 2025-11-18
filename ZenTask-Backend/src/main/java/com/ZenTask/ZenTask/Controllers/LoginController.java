package com.ZenTask.ZenTask.Controllers;

import com.ZenTask.ZenTask.Entities.AppUser;
import com.ZenTask.ZenTask.DTOs.LoginReq;
import com.ZenTask.ZenTask.repo.UserRepo;
import com.ZenTask.ZenTask.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // allow cookies
public class LoginController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/api/auth/login")
    private ResponseEntity<?> login(@RequestBody LoginReq req) {
        // Check if user exists
        AppUser user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Email"));

        // Match password
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong Password");
        }

        String jwtToken = tokenService.generateToken(req.getEmail());

//        // Build the cookie
//        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
//                .httpOnly(true)            // not accessible by JavaScript
//                .path("/")                 // cookie available for the whole app
//                .maxAge(24 * 60 * 60)      // 1 day
//                .sameSite("Strict")        // prevent CSRF
//                .build();
//
//        // Return response with cookie
//        return ResponseEntity.ok()
//                .header(HttpHeaders.SET_COOKIE, cookie.toString())
//                .body(Map.of(
//                        "message", "Login Successful",
//                        "username", user.getUsername(),
//                        "email", user.getEmail()
//                ));

        return ResponseEntity.ok(Map.of(
                "token", jwtToken,
                "user", Map.of("id", user.getId(), "name", user.getUsername(), "email", user.getEmail())
        ));
    }
}
