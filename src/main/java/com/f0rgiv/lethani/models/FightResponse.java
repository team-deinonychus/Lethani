package com.f0rgiv.lethani.models;

public class FightResponse {
    private Fight fight;
    public FightResponse(){}
    public FightResponse(Fight fight) {
        this.fight = fight;
    }

    public Fight getFight() {
        return fight;
    }
}
