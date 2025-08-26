package com.samma.rcp.app.orchestration;

import com.samma.rcp.app.config.RosDockerProps;
import com.samma.rcp.app.domain.entity.SimulationSession;
import com.samma.rcp.app.domain.model.RobotModel;
import com.samma.rcp.app.domain.model.ScenarioType;
import com.samma.rcp.app.domain.model.SimulationStatus;
import com.samma.rcp.app.domain.repo.SimulationSessionRepository;
import com.samma.rcp.app.ws.RobotSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class SimulationOrchestrator {

    private final RosDockerProps props;
    private final DockerService docker;
    private final RosBridgeClient ros;
    private final SimulationSessionRepository sessions;
    private final RobotSocketHandler.WebSocketController ws;

    public SimulationSession start(RobotModel model, ScenarioType scenario) {
        String compose = props.getDocker().getComposeFile();

        SimulationSession s = sessions.save(SimulationSession.builder()
                .model(model)
                .scenario(scenario)
                .status(SimulationStatus.STARTING)
                .rosBridgeUrl(props.getBridge().getUrl())
                .videoUrl(props.getVideo().getStreamUrl())
                .startedAt(LocalDateTime.now())
                .build());
        ws.broadcastStatus(s);

        Map<String, String> env = new HashMap<>(System.getenv());
        env.put("TURTLEBOT3_MODEL", model.toEnvValue());
        env.put("SCENARIO_KEY", scenario.name());
        env.put("ROSBRIDGE_PORT", "9090");

        docker.composeUp(compose, env);

        boolean ok = docker.waitForPort("localhost", 9090, Duration.ofMillis(props.getSimulation().getStartupTimeout()));
        if (!ok) {
            s.setStatus(SimulationStatus.ERROR);
            s.setErrorMessage("rosbridge not ready");
            sessions.save(s);
            ws.broadcastStatus(s);
            throw new IllegalStateException("rosbridge not ready");
        }

        ros.connect(props.getBridge().getUrl());
        s.setStatus(SimulationStatus.RUNNING);
        sessions.save(s);
        ws.broadcastStatus(s);
        return s;
    }

    public SimulationSession stop() {
        docker.composeDown(props.getDocker().getComposeFile(), System.getenv());
        ros.disconnect();
        SimulationSession running = sessions.findTopByStatusOrderByStartedAtDesc(SimulationStatus.RUNNING).orElse(null);
        if (running != null) {
            running.setStatus(SimulationStatus.STOPPED);
            running.setEndedAt(LocalDateTime.now());
            sessions.save(running);
            ws.broadcastStatus(running);
        }
        return running;
    }

    public SimulationSession current() {
        return sessions.findTopByStatusOrderByStartedAtDesc(SimulationStatus.RUNNING)
                .orElseGet(() -> sessions.findTopByStatusOrderByStartedAtDesc(SimulationStatus.STARTING).orElse(null));
    }
}
