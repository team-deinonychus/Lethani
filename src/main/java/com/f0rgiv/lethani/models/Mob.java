package com.f0rgiv.lethani.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Mob {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    String name;
    int hp;
    int damage;

    //===============Constructors========================

    public Mob() {
    }

    public Mob(String name, int hp, int damage) {
        this.name = name;
        this.hp = hp;
        this.damage = damage;
    }

    //=====================Getters====================

    public long getId() {
        return id;
    }

    //=====================Setters====================

}
