package com.samma.rcp.app.service;

import com.samma.rcp.app.domain.entity.SimulationSession;
import com.samma.rcp.app.domain.model.*;
import com.samma.rcp.app.domain.repo.SimulationSessionRepository;
import com.samma.rcp.app.dto.SimulationStatusDTO;
import com.samma.rcp.app.orchestration.SimulationOrchestrator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final SimulationOrchestrator orchestrator;
    private final SimulationSessionRepository sessions;

    public SimulationStatusDTO start(RobotModel model, ScenarioType scenario) {
        SimulationSession s = orchestrator.start(model, scenario);
        return toStatusDto(s, "Simulation running");
    }

    public SimulationStatusDTO stop() {
        SimulationSession s = orchestrator.stop();
        return s == null ? SimulationStatusDTO.builder().status(SimulationStatus.STOPPED).message("No running session").build()
                : toStatusDto(s, "Simulation stopped");
    }

    public SimulationStatusDTO status() {
        SimulationSession s = orchestrator.current();
        return s == null ? SimulationStatusDTO.builder().status(SimulationStatus.STOPPED).message("No active session").build()
                : toStatusDto(s, null);
    }

    private SimulationStatusDTO toStatusDto(SimulationSession s, String msg) {
        return SimulationStatusDTO.builder()
                .sessionId(s.getId())
                .model(s.getModel())
                .scenario(s.getScenario())
                .status(s.getStatus())
                .rosBridgeUrl(s.getRosBridgeUrl())
                .videoUrl(s.getVideoUrl())
                .message(msg)
                .build();
    }
}
