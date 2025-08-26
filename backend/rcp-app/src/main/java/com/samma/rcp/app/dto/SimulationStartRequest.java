package com.samma.rcp.app.dto;

import com.samma.rcp.app.domain.model.RobotModel;
import com.samma.rcp.app.domain.model.ScenarioType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SimulationStartRequest {
    @NotNull private RobotModel model;
    @NotNull private ScenarioType scenario;
}
