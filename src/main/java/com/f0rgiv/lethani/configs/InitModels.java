package com.f0rgiv.lethani.configs;

import com.f0rgiv.lethani.services.CharacterClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class InitModels {
    @Autowired
    CharacterClassService characterClassService;

    @PostConstruct
    public void init(){
        characterClassService.getAll();
    }
}
