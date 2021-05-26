package com.f0rgiv.lethani.models;

public class Player {
     Position position;
     String name;

    public Player() {
    }

    public Player(Position player) {
        this.position = player;
    }

    public Position getPosition() {
        return position;
    }

    public String getName() {
        return name;
    }

    public void setPosition(Position player) {
        this.position = player;
    }

    public void setName(String name) {
        this.name = name;
    }
}
