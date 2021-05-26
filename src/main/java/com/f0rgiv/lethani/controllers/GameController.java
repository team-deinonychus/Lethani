package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.*;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class GameController {

    ArrayList<Player> playerList = new ArrayList<>();

    @MessageMapping("/gameLogic/1")
    @SendTo("/game/zone/1")
    public List<Player> playerResponse(Principal principal, Player position) throws Exception {
        System.out.println(position);
        Position position1 = position.getPosition();

        //if the player is in list update location
        boolean notFound = true;
        for (Player player : playerList) {
            if (player.getName().equals(principal.getName())){
                player.setPosition(position1);
                notFound = false;
                break;
            }
        }
        //else add player to list
        if(notFound) {
            playerList.add(new Player(position1, principal.getName()));
        }
        return playerList;
    }
}
