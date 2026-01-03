package com.samma.rcp.app.dto;

import com.samma.rcp.app.domain.model.RobotModel;
import com.samma.rcp.app.domain.model.ScenarioType;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class SimulationStartRequest {
    @NotNull(message = "Robot model must be specified.")
    private RobotModel model;

    @NotNull(message = "Scenario type must be specified.")
    private ScenarioType scenario;
}