package com.samma.rcp.app.orchestration;

import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

/**
 * Docker Compose’i kaldırır/indirir. Port bekler.
 *
 * Özelleştirilebilirlik:
 *  - Compose dosyası yolu:
 *      * JVM: -Dros.compose.file=ros-stack/docker-compose.yml
 *      * ENV: ROS_COMPOSE_FILE=ros-stack/docker-compose.yml
 *    (Varsayılan: ros-stack/docker-compose.yml)
 *  - WebSocket portu:
 *      * JVM: -Dros.ws.port=9090
 *      * ENV: ROS_WS_PORT=9090
 *    (Varsayılan: 9090)
 */
@Component
public class SimulationOrchestrator {
    private final DockerService docker;

    private final Path compose = Paths.get(
            System.getProperty("ros.compose.file",
                    System.getenv().getOrDefault("ROS_COMPOSE_FILE", "ros-stack/docker-compose.yml"))
    ).toAbsolutePath();

    private final int wsPort = Integer.parseInt(
            System.getProperty("ros.ws.port",
                    System.getenv().getOrDefault("ROS_WS_PORT", "9090"))
    );

    public SimulationOrchestrator(DockerService docker) {
        this.docker = docker;
    }

    public void start() {
        docker.composeUp(compose);
        // Konteyner ayağa kalkana kadar WS portunu bekle
        boolean ok = docker.waitForPort("localhost", wsPort, Duration.ofSeconds(25));
        if (!ok) throw new IllegalStateException("ROSBridge " + wsPort + " açılmadı");
    }

    public void stop() {
        docker.composeDown(compose);
    }

    public boolean isRunning() {
        return docker.waitForPort("localhost", wsPort, Duration.ofSeconds(1));
    }

    public int getWsPort() {
        return wsPort;
    }
}
