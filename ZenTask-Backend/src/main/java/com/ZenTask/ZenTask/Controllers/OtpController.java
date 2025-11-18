package com.ZenTask.ZenTask.Controllers;

import com.ZenTask.ZenTask.DTOs.SignUpReq;
import com.ZenTask.ZenTask.Entities.AppUser;
import com.ZenTask.ZenTask.repo.UserRepo;
import com.ZenTask.ZenTask.services.OtpService;
import com.ZenTask.ZenTask.services.TokenService;
import com.ZenTask.ZenTask.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "http://localhost:5173") // frontend URL
public class OtpController {

    @Autowired
    private OtpService otpService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepo userRepo;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        if (userRepo.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User already exists with this email");
        }
        otpService.sendOtp(email);
        return ResponseEntity.ok("Email sent successfully..");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody SignUpReq request) {
        // Now get the user and otp from the request object
        AppUser user = request.getUser();
        String otp = request.getOtp();

        boolean isValid = otpService.validateOtp(user.getEmail(),otp); // This still has the security issue from the previous discussion!
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid OTP");
        }

        userService.createProfile(user);
        return ResponseEntity.ok("User Registered Successfully !!");
    }
}
