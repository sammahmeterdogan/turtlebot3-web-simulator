package com.samma.rcp.app.orchestration;

import com.samma.rcp.app.dto.SimulationStartRequest;
import com.samma.rcp.app.domain.model.ScenarioType;
import org.springframework.stereotype.Component;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SimulationOrchestrator {
    private final DockerService docker;
    private final Path composeFile = Paths.get(System.getenv().getOrDefault("ROS_COMPOSE_FILE", "ros-stack/docker-compose.yml")).toAbsolutePath();
    private final int wsPort = Integer.parseInt(System.getenv().getOrDefault("ROS_BRIDGE_PORT", "9090"));

    private volatile SimulationStartRequest currentSimulation = null;
    private volatile boolean isRunning = false;

    public SimulationOrchestrator(DockerService docker) {
        this.docker = docker;
        // Başlangıçta çalışan bir konteyner var mı diye kontrol et
        this.isRunning = docker.isContainerRunning("rosbridge");
    }

    public synchronized void start(SimulationStartRequest request) {
        if (isRunning) {
            stop();
        }

        List<String> servicesToStart = new ArrayList<>();
        servicesToStart.add("rosbridge");

        Map<String, String> environment = Map.of(
                "TURTLEBOT3_MODEL", request.getModel().name().toLowerCase()
        );

        if (request.getScenario() == ScenarioType.TURTLESIM) {
            servicesToStart.add("turtlesim");
        } else {
            servicesToStart.add("tb3-sim");
            if (request.getScenario() == ScenarioType.SLAM) {
                servicesToStart.add("tb3-slam");
            }
            if (request.getScenario() == ScenarioType.NAVIGATION) {
                servicesToStart.add("tb3-nav");
            }
        }

        docker.composeUp(composeFile, environment, servicesToStart.toArray(new String[0]));

        boolean ok = docker.waitForPort("localhost", wsPort, Duration.ofSeconds(45));
        if (!ok) {
            stop(); // Başlatma başarısız olursa temizle
            throw new IllegalStateException("ROSBridge " + wsPort + " portu zaman aşımına uğradı.");
        }

        this.currentSimulation = request;
        this.isRunning = true;
    }

    public synchronized void stop() {
        docker.composeDown(composeFile);
        this.currentSimulation = null;
        this.isRunning = false;
    }

    public boolean isRunning() {
        this.isRunning = docker.isContainerRunning("rosbridge");
        return this.isRunning;
    }

    public int getWsPort() {
        return wsPort;
    }

    public SimulationStartRequest getCurrentSimulation() {
        return isRunning ? currentSimulation : null;
    }
}