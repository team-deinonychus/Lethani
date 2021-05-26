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
    Position test = new Position(10, 12);
    Player newPlayer = new Player(test);

    @MessageMapping("/gameLogic/1")
    @SendTo("/game/zone/1")
    public List<Player> playerResponse(Principal principal, Player position) throws Exception {

        if(playerList.size() == 0) {
            newPlayer.setName("searoids");
            playerList.add(newPlayer);
        }
        for (Player player : playerList) {
            if (player.getName().equals(principal.getName())) {
                player.setPosition(position.getPosition());
            }
        }
        return playerList;

    }
}
