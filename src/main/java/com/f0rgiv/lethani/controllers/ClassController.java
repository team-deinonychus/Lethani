package com.f0rgiv.lethani.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.servlet.view.RedirectView;

public class ClassController {
    @GetMapping("/class")
    public String GetClasses() {
        return null;
    }

    @GetMapping("/class/{id}")
    public String GetClass() {
        return null;
    }

    /**
     * @return updates character class for the principal.user
     * Put /profile/character
     * Requires authentication
     * <p>
     * Allows a user to update their character class.
     */
    @PutMapping("/class/{id}")
    public RedirectView updateClass(){
        return null;
    }
}
