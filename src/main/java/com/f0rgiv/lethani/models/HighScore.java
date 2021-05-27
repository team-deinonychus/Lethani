package com.f0rgiv.lethani.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class HighScore {

    String name;
    String characterClass;
    int highScore;
    AppUser userPrincipal;

    //===============Constructors========================
    public HighScore(String username){

    }

    public HighScore(String name, String characterClass, int highScore, AppUser userPrincipal){
        this.name = name;
        this.characterClass = characterClass;
        this.highScore = highScore;
        this.userPrincipal = userPrincipal;
    }

    //=====================Getters====================


    public String getName() {
        return name;
    }

    public String getCharacterClass() {
        return characterClass;
    }

    public int getHighScore() {
        return highScore;
    }

    public AppUser getUserPrincipal() {
        return userPrincipal;
    }

    //=====================Setters====================



}
