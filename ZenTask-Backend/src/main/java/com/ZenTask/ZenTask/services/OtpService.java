package com.ZenTask.ZenTask.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTP and its expiry time
    private final Map<String, OtpEntry> otpMap = new ConcurrentHashMap<>();

    private static final long OTP_EXPIRY_MILLIS = 5 * 60 * 1000; // 5 minutes

    // Inner class to store OTP and expiry
    private static class OtpEntry {
        String otp;
        long expiryTime;

        OtpEntry(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    // Generate a 6-digit OTP
    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999_999));
    }

    // Send OTP email and store it with expiry
    public void sendOtp(String toEmail) {
        String otp = generateOtp();
        long expiryTime = Instant.now().toEpochMilli() + OTP_EXPIRY_MILLIS;

        // Store OTP in map
        otpMap.put(toEmail, new OtpEntry(otp, expiryTime));

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("darshbalar02@gmail.com"); // change to your email
        message.setTo(toEmail);
        message.setSubject("Verification Code");
        message.setText("Your OTP is: " + otp + "\nIt will expire in 5 minutes.");

        mailSender.send(message);
    }

    // Validate OTP
    public boolean validateOtp(String email, String inputOtp) {
        OtpEntry entry = otpMap.get(email);

        if (entry == null) return false;

        long now = Instant.now().toEpochMilli();

        // Check expiry
        if (now > entry.expiryTime) {
            otpMap.remove(email); // remove expired OTP
            return false;
        }

        boolean valid = inputOtp.equals(entry.otp);

        if (valid) otpMap.remove(email); // remove after successful verification

        return valid;
    }

    // Scheduled cleanup every 5 minutes
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cleanupExpiredOtps() {
        long now = Instant.now().toEpochMilli();
        otpMap.entrySet().removeIf(entry -> entry.getValue().expiryTime <= now);
    }
}
