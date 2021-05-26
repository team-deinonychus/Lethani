package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.AppUser;
import com.f0rgiv.lethani.models.Character;
import com.f0rgiv.lethani.repositories.AppUserRepository;
import com.f0rgiv.lethani.services.PasswordReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

@Controller
public class AuthController {

    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    PasswordReqService passwordReqService;

    @GetMapping("/login")
    public String showLogin() {
        return "login";
    }

    @GetMapping("/signup")
    public String showSignup(String error, Model model) {
        System.out.println("about to sign Up");
        if (error != null) {
            if (error.equals("username_exists"))
                model.addAttribute("errorMessage", "The username has already been taken.");
            else if (passwordReqService.errorText.containsKey(error))
                model.addAttribute("errorMessage", passwordReqService.errorText.get(error));
        }
        System.out.println("about to return");
        return "signup";
    }

    // POST /signup: Creates a new user when they sign up. Redirects user to user account page /users/
    @PostMapping("/signup")
    public RedirectView createUser(String username,
                             String password,
                             HttpServletRequest request) {
        if (appUserRepository.existsByUsername(username))
            return new RedirectView("/signup?error=username_exists");

        String passwordError = passwordReqService.validate(password);
        if (passwordError != null) return new RedirectView("/signup?error=" + passwordError);

//      ================ Create User =============

        AppUser user = new AppUser(username, passwordEncoder.encode(password), username);
        Character character = new Character(username, user);
        user.setCharacter(character);
        appUserRepository.save(user);

//      ============== Sign in User ============
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
        token.setDetails(new WebAuthenticationDetails(request));
        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new RedirectView("/profile");
    }
}
