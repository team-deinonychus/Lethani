package com.f0rgiv.lethani.models;

public class Fight {

    int dmgGiven;
    String defender;

    public Fight() {
    }

    public Fight(int dmgGiven, String defender) {
        this.dmgGiven = dmgGiven;
        this.defender = defender;
    }

    public int getDmgGiven() {
        return dmgGiven;
    }

    public void setDmgGiven(int dmgGiven) {
        this.dmgGiven = dmgGiven;
    }

    public String getDefender() {
        return defender;
    }

    public void setDefender(String defender) {
        this.defender = defender;
    }

    @Override
    public String toString() {
        return "Fight{" +
                "dmgGiven=" + dmgGiven +
                ", defender='" + defender + '\'' +
                '}';
    }
}
