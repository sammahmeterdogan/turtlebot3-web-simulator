package com.samma.rcp.app.service;

import com.samma.rcp.app.domain.SimStatusDto; // DTO sende zaten var
import com.samma.rcp.app.orchestration.SimulationOrchestrator;
import org.springframework.stereotype.Service;

/**
 * İnce servis katmanı; Controller ile Orchestrator arasındaki köprü.
 * DÖNÜŞ: Her zaman SimStatusDto (UI tek tip JSON beklesin).
 */
@Service
public class SimulationService {

    private final SimulationOrchestrator orchestrator;

    public SimulationService(SimulationOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    /** Simülasyonu başlatır ve websocket bilgisiyle birlikte durum döner. */
    public SimStatusDto start() {
        orchestrator.start();
        return buildStatus();
    }

    /** Simülasyonu durdurur ve güncel durumu döner. */
    public SimStatusDto stop() {
        orchestrator.stop();
        return buildStatus();
    }

    /** Anlık durumu döner. */
    public SimStatusDto status() {
        return buildStatus();
    }

    // ---- helper ----
    private SimStatusDto buildStatus() {
        boolean running = orchestrator.isRunning();
        int port = orchestrator.getWsPort(); // Orchestrator’ında hazır.
        // Ortam değişkeniyle host override edilebilir; yoksa localhost.
        String host = System.getenv().getOrDefault("ROSBRIDGE_HOST", "localhost");
        String wsUrl = "ws://" + host + ":" + port;
        return new SimStatusDto(running, wsUrl, port);
    }
}
