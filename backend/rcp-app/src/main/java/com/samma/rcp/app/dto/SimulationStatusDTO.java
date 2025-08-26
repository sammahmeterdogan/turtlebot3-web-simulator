package com.samma.rcp.app.dto;

import com.samma.rcp.app.domain.model.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SimulationStatusDTO {
    private Long sessionId;
    private RobotModel model;
    private ScenarioType scenario;
    private SimulationStatus status;
    private String rosBridgeUrl;
    private String videoUrl;
    private String message;
}
