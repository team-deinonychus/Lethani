package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

public class AuthController {

    @Autowired
    AppUserRepository appUserRepository;

    @GetMapping("/login")
    public String showLogin() {
        return "login";
    }

    @GetMapping("/signup")
    public String showSignup(String error, Model model) {
        return null;
    }

    // POST /signup: Creates a new user when they sign up. Redirects user to user account page /users/
    @PostMapping("/signup")
    public String createUser(String username,
                             String password,
                             String displayName,
                             HttpServletRequest request) {
//        if (appUserRepository.existsByUsername(username))
//            return new RedirectView("/signup?error=username_exists");
        return null;
    }
}
