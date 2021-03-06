package com.f0rgiv.lethani.services;

import com.f0rgiv.lethani.models.CharacterClass;
import com.f0rgiv.lethani.repositories.CharacterClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CharacterClassService {

    @Autowired
    CharacterClassRepository characterClassRepository;

    public List<CharacterClass> getAll() {
        List<CharacterClass> classes = characterClassRepository.findAll();
        //if classes don't exist in db create them and then return them.
        if (classes.size() == 0) {
            classes.add(new CharacterClass("Warrior", 2, .75, 2));
            classes.add(new CharacterClass("Wizard", 1, 1.25, 1));
            classes.add(new CharacterClass("Assassin", 1.25, 2, 1));
            classes.forEach(cc -> characterClassRepository.save(cc));
        }
        return classes;
    }

    public CharacterClass findByName(String className) {
        CharacterClass result = characterClassRepository.findByName(className);
        if (result == null){
            getAll();
            result = characterClassRepository.findByName(className);
        }
        return result;
    }

    public CharacterClass getDefaultClass(){
        CharacterClass result = characterClassRepository.findByName("Warrior");
        if (result == null){
            getAll();
            result = characterClassRepository.findByName("Warrior");
        }
        return result;
    }
}
