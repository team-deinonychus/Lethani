package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class MainController {

    @Autowired
    AppUserRepository appUserRepository;

    @GetMapping("/")
    public String getIndex(Model m) { return "index"; }

    @GetMapping("/about")
    public String getAbout() {
        return "about-us";
    }

    @GetMapping("/play")
    public String getPlay() { return "play"; }

    @GetMapping("/leaderboard")
    public String getLeaderBoard(){ return "leader-board";}
}
