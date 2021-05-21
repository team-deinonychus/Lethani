package com.f0rgiv.lethani.services;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PasswordReqService {
    public final Map<String, String> errorText = Map.ofEntries(
            Map.entry("password_length", "Password must be at least 6 characters"),
            Map.entry("password_invalid", "Password must contain a number")
    );

    public String validate(String password) {
        if (password.length() < 6) return "password_length";
        boolean hasNumber = password.matches(".*[0-9]*.");
        boolean hasLowercase = password.matches(".*[a-z]*.");
        boolean hasUppercase = password.matches(".*[A-Z]*.");

        if (!hasNumber || !hasLowercase || hasUppercase) return "password_invalid";
        else return null;
    }
}
