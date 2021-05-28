package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.*;
import com.f0rgiv.lethani.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class GameController {
    static int boardCount = 10;

    @Autowired
    AppUserRepository appUserRepository;

    static List<ArrayList<Player>> boardPlayers = new ArrayList<>();
    static {
        for (int i = 0; i < boardCount; i++) {
            boardPlayers.add(new ArrayList<>());
        }
    }

    @MessageMapping("/gameLogic/0")
    @SendTo("/game/zone/0")
    public List<Player> playerResponse0(Principal principal, Player position) {
        return updatePlayers(principal, position, 0);
    }

    @MessageMapping("/gameLogic/1")
    @SendTo("/game/zone/1")
    public List<Player> playerResponse1(Principal principal, Player position) {
        return updatePlayers(principal, position, 1);
    }

    @MessageMapping("/gameLogic/2")
    @SendTo("/game/zone/2")
    public List<Player> playerResponse2(Principal principal, Player position) {
        return updatePlayers(principal, position, 2);
    }

    @MessageMapping("/gameLogic/3")
    @SendTo("/game/zone/3")
    public List<Player> playerResponse3(Principal principal, Player position) {
        return updatePlayers(principal, position, 3);
    }

    @MessageMapping("/gameLogic/4")
    @SendTo("/game/zone/4")
    public List<Player> playerResponse4(Principal principal, Player position) {
        return updatePlayers(principal, position, 3);
    }

    @MessageMapping("/gameLogic/5")
    @SendTo("/game/zone/5")
    public List<Player> playerResponse5(Principal principal, Player position) {
        return updatePlayers(principal, position, 3);
    }

    @MessageMapping("/pvp")
    @SendTo("/game/pvp")
    public FightResponse fightResponse0(Principal principal, Fight fight) {
        System.out.println(fight);
        return new FightResponse(fight);
    }

    @PostMapping("/updatexp/{xp}")
    @ResponseStatus(value = HttpStatus.OK)
    public void updateXp(@PathVariable String xp, Principal principal) {
        int newXp = Integer.parseInt(xp);
        AppUser UserChar = appUserRepository.findByUsername(principal.getName());
        UserChar.getCharacter().setXp(newXp + UserChar.getCharacter().getXp());
        appUserRepository.save(UserChar);
        System.out.println(xp);
    }

    private ArrayList<Player> updatePlayers(Principal principal, Player position, int toZone) {
        Position position1 = position.getPosition();

        //remove from old map
        for (int i = 0; i < boardPlayers.size(); i++) {
            if (i != toZone) boardPlayers.get(i).removeIf(oldPlayer -> oldPlayer.getName().equals(principal.getName()));
        }

        //if the player is in list update location
        boolean notFound = true;
        for (Player player : boardPlayers.get(toZone)) {
            if (player.getName().equals(principal.getName())){
                player.setPosition(position1);
                notFound = false;
                break;
            }
        }
        //else add player to list
        if(notFound) {
            boardPlayers.get(toZone).add(new Player(position1, principal.getName()));
        }
        return boardPlayers.get(toZone);
    }
}

