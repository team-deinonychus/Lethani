package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.AppUser;
import com.f0rgiv.lethani.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Controller
public class UserController {
    @Autowired
    AppUserRepository appUserRepository;


    /**
     * @return editable details for the principal.user
     * GET /profile
     * Requires authentication
     * <p>
     * Provides a view that allows users to edit their own profile, edit and add their posts
     */
    @GetMapping("/profile")
    public String getProfile() {
        return "profile";
    }

    /**
     * @return updates details for the principal.user
     * Put /profile
     * Requires authentication
     * <p>
     * Allows user to update their information.
     */
    @PutMapping("/profile")
    public RedirectView updateProfile(String displayName,
                                      HttpServletRequest request) throws IOException {
        AppUser userPrincipal = appUserRepository.findByUsername(request.getUserPrincipal().getName());
        appUserRepository.save(userPrincipal);
        return new RedirectView("profile");
    }

    /**
     * @return updates profile picture for the principal.user
     * Put /profile/image
     * Requires authentication
     * <p>
     * Allows a user to update their profile picture by uploading a new one.
     */
    @PutMapping("/profile/image")
    public RedirectView updateProfileImage(@RequestParam("image") MultipartFile multipartFile,
                                           HttpServletRequest request) throws IOException {
        AppUser userPrincipal = appUserRepository.findByUsername(request.getUserPrincipal().getName());
        return new RedirectView("/profile");
    }
}