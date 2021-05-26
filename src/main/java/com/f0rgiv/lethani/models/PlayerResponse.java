package com.f0rgiv.lethani.models;

public class PlayerResponse {
    private Player player;

    public PlayerResponse(){}
    public PlayerResponse(Player player) { this.player = player; }

    public Player getPlayer() {
        return player;
    }
}