package com.f0rgiv.lethani.repositories;

import com.f0rgiv.lethani.models.CharacterClass;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacterClassRepository extends JpaRepositoryImplementation<CharacterClass, Long> {
    CharacterClass findByName(String name);
}
