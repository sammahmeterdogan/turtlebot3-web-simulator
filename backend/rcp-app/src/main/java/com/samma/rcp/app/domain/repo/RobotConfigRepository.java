package com.samma.rcp.app.domain.repo;

import com.samma.rcp.app.domain.entity.RobotConfig;
import com.samma.rcp.app.domain.model.RobotModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RobotConfigRepository extends JpaRepository<RobotConfig, Long> {
    Optional<RobotConfig> findTopByModelOrderByCreatedAtDesc(RobotModel model);
}
