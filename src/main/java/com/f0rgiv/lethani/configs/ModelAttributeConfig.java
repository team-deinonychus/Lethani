package com.f0rgiv.lethani.configs;

import com.f0rgiv.lethani.models.AppUser;
import com.f0rgiv.lethani.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.security.Principal;

@ControllerAdvice
public class ModelAttributeConfig {
    @Autowired
    AppUserRepository appUserRepository;

    @ModelAttribute
    public void addUser(Model model, Principal principal) {
        // Populates the principal attribute of the model if a user is currently authenticated.
        if(principal != null) {
            AppUser userPrincipal = appUserRepository.findByUsername(principal.getName());
            model.addAttribute("userPrincipal", userPrincipal);
        }
    }
}
