package com.f0rgiv.lethani.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class CharacterClass {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    String name;
    double hpMultiplier;
    double attackMultiplier;
    double defenceMultiplier;

    //===============Constructors========================

    public CharacterClass() {
    }

    public CharacterClass(String name, double hpMultiplier, double attackMultiplier, double defenceMultiplier) {
        this.name = name;
        this.hpMultiplier = hpMultiplier;
        this.attackMultiplier = attackMultiplier;
        this.defenceMultiplier = defenceMultiplier;
    }

    //=====================Getters====================

    public long getId() {
        return id;
    }

    //=====================Setters====================

}
