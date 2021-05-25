package com.f0rgiv.lethani.services;

import com.f0rgiv.lethani.models.Mob;
import com.f0rgiv.lethani.repositories.MobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MobService {

    @Autowired
    MobRepository mobRepository;

    public List<Mob> getAll() {
        List<Mob> mobs = mobRepository.findAll();
        if (mobs.size() == 0) {
            mobs.add(new Mob("lil baddie", 10, 1));
            mobs.add(new Mob("normal enemy", 25, 5));
            mobs.add(new Mob("Super scary monster", 50, 10));
            mobs.forEach(mob -> mobRepository.save(mob));
        }
        return mobs;
    }
}
