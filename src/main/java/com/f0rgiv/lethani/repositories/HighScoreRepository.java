package com.f0rgiv.lethani.repositories;

import com.f0rgiv.lethani.models.HighScore;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

public interface HighScoreRepository extends JpaRepositoryImplementation<HighScore, Long> {
}
