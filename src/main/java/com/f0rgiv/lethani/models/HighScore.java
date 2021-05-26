package com.f0rgiv.lethani.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class HighScore {

    String name;
    String characterClass;
    int highScore;

    //===============Constructors========================
    public HighScore(String username){

    }

    public HighScore(String name, String characterClass, int highScore){
        this.name = name;
        this.characterClass = characterClass;
        this.highScore = highScore;
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

    //=====================Setters====================



}
