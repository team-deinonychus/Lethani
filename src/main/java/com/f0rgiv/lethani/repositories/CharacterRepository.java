package com.f0rgiv.lethani.repositories;

import com.f0rgiv.lethani.models.AppUser;
import com.f0rgiv.lethani.models.Character;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacterRepository extends JpaRepositoryImplementation<Character, Long> {
}
