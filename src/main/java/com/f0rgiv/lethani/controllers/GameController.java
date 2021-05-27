package com.f0rgiv.lethani.controllers;

import com.f0rgiv.lethani.models.*;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
public class GameController {

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

