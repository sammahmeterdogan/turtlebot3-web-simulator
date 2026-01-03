package com.samma.rcp.app.service;

import com.samma.rcp.app.dto.SimStatusDto;
import com.samma.rcp.app.dto.SimulationStartRequest;
import com.samma.rcp.app.orchestration.SimulationOrchestrator;
import org.springframework.stereotype.Service;

@Service
public class SimulationService {

    private final SimulationOrchestrator orchestrator;

    public SimulationService(SimulationOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    public SimStatusDto start(SimulationStartRequest request) {
        orchestrator.start(request);
        return buildStatus();
    }

    public SimStatusDto stop() {
        orchestrator.stop();
        return buildStatus();
    }

    public SimStatusDto getStatus() {
        return buildStatus();
    }

    // Bu metod, orkestratörden aldığı bilgiyle durum DTO'sunu oluşturur.
    // Robot kontrolü veya rosbridge bağlantısı hakkında hiçbir şey bilmez.
    private SimStatusDto buildStatus() {
        boolean running = orchestrator.isRunning();
        SimulationStartRequest currentSim = orchestrator.getCurrentSimulation();

        String host = System.getenv().getOrDefault("ROSBRIDGE_HOST", "localhost");
        int port = orchestrator.getWsPort();
        String wsUrl = running ? "ws://" + host + ":" + port : null;

        return SimStatusDto.builder()
                .running(running)
                .wsUrl(wsUrl)
                .port(port)
                .model(currentSim != null ? currentSim.getModel() : null)
                .scenario(currentSim != null ? currentSim.getScenario() : null)
                .message(running ? "Simulation is active." : "Simulation is stopped.")
                .build();
    }
}