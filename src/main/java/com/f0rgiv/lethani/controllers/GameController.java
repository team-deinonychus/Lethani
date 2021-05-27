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

    @Autowired
    AppUserRepository appUserRepository;

    ArrayList<Player> playerList1 = new ArrayList<>();
    ArrayList<Player> playerList2 = new ArrayList<>();

    @MessageMapping("/gameLogic/1")
    @SendTo("/game/zone/1")
    public List<Player> playerResponse(Principal principal, Player position) {
        return updatePlayers(principal, position, playerList2, playerList1);
    }

    @MessageMapping("/gameLogic/2")
    @SendTo("/game/zone/2")
    public List<Player> playerResponse2(Principal principal, Player position) {
        return updatePlayers(principal, position, playerList1, playerList2);
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

    private ArrayList<Player> updatePlayers(Principal principal, Player position,ArrayList<Player> listToUpdate,ArrayList<Player> listToRemove) {
        Position position1 = position.getPosition();

        //if the player is in list update location
        boolean notFound = true;
        for (Player player : listToUpdate) {
            if (player.getName().equals(principal.getName())){
                listToRemove.removeIf(oldPlayer -> oldPlayer.getName().equals(principal.getName()));
                player.setPosition(position1);
                notFound = false;
                break;
            }
        }
        //else add player to list
        if(notFound) {
            listToUpdate.add(new Player(position1, principal.getName()));
        }
        return listToUpdate;
    }
}

