package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.AppUser;
import com.f0rgiv.lethani.models.Character;
import com.f0rgiv.lethani.models.CharacterClass;
import com.f0rgiv.lethani.models.HighScore;
import com.f0rgiv.lethani.repositories.AppUserRepository;
import com.f0rgiv.lethani.repositories.CharacterClassRepository;
import com.f0rgiv.lethani.repositories.CharacterRepository;
import com.f0rgiv.lethani.services.AppUserService;
import com.f0rgiv.lethani.services.CharacterClassService;
import org.apache.tomcat.util.http.fileupload.impl.InvalidContentTypeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import javax.lang.model.element.Name;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UserController {
    @Autowired
    AppUserRepository appUserRepository;

    @Autowired
    CharacterRepository characterRepository;

    @Autowired
    CharacterClassService characterClassService;

    @Autowired
    AppUserService appUserService;

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
                                      HttpServletRequest request) {
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
    public RedirectView updateProfileImage( @RequestParam("image") MultipartFile multipartFile,
                                            HttpServletRequest request) throws IOException {
        AppUser userPrincipal = appUserRepository.findByUsername(request.getUserPrincipal().getName());

        try {
            appUserService.updateProfilePicture(userPrincipal, multipartFile);
        } catch (InvalidContentTypeException e) {
            return new RedirectView("/profile?error=content_type");
        }
        appUserRepository.save(userPrincipal);
        return new RedirectView("/profile");
    }

    /**
     * @return updates the cherectarClass for the principal.user
     * Put /profile/class
     * Requires authentication
     * <p>
     * Allows a user to update their profile picture by uploading a new one.
     */
    @PutMapping("/profile/class")
    public RedirectView updateProfileClass( @RequestParam("characterClass") String className,
                                            HttpServletRequest request) {
        Character character = appUserRepository.findByUsername(request.getUserPrincipal().getName()).getCharacter();
        character.setCharacterClass(characterClassService.findByName(className));
        characterRepository.save(character);
        return new RedirectView("/profile");
    }

    /**
     * @return users profile information to the leader board page
     * Get /leaderboard
     * Requires authentication
     * <p>
     * Allows user to post user image and score to the leader board
     * **/

    @GetMapping("/leaderboard")
    public String addProfileInformationToLeaderBoard(Model model) {
        List<AppUser> appUsers = appUserRepository.findAll();
        System.out.println("appUsers: " + appUsers.size());
        List<HighScore> highScores = new ArrayList<>();
        for (AppUser user : appUsers){
//            System.out.println("user: " + user.getCharacter());
            highScores.add(new HighScore(user.getUsername(), user.getCharacter().getCharacterClass().getName(), user.getCharacter().getXp()));

        }
        model.addAttribute("highScores", highScores);
        return "leader-board";
    }
}
