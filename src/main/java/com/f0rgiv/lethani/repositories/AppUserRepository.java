package com.f0rgiv.lethani.repositories;

import com.f0rgiv.lethani.models.AppUser;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface AppUserRepository extends JpaRepositoryImplementation<AppUser, Long> {
    AppUser findByUsername(String username);

    boolean existsByUsername(String username);
}
