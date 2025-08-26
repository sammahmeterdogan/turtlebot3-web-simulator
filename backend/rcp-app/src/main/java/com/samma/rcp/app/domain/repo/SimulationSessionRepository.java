package com.samma.rcp.app.domain.repo;

import com.samma.rcp.app.domain.entity.SimulationSession;
import com.samma.rcp.app.domain.model.SimulationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SimulationSessionRepository extends JpaRepository<SimulationSession, Long> {
    Optional<SimulationSession> findTopByStatusOrderByStartedAtDesc(SimulationStatus status);
    List<SimulationSession> findByStatus(SimulationStatus status);
}
