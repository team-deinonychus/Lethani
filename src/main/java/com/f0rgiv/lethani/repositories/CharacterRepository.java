package com.f0rgiv.lethani.repositories;

import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacterRepository extends JpaRepositoryImplementation<Character, Long> {

}
