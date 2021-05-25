package com.f0rgiv.lethani.models;

import javax.persistence.*;

@Entity
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    String name; //TODO
    int xp;
    int hp;

    @OneToOne(mappedBy = "character")
    AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "character_class_id")
    CharacterClass characterClass;

    //===============Constructors========================

    public Character() {
    }

    public Character(String name, int xp, int hp, AppUser appUser, CharacterClass characterClass) {
        this.name = name;
        this.xp = xp;
        this.hp = hp;
        this.appUser = appUser;
        this.characterClass = characterClass;
    }

    //=====================Getters====================

    public long getId() {
        return id;
    }

    //=====================Setters====================

}
