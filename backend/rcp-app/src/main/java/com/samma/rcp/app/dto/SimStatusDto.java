package com.samma.rcp.app.dto;

import com.samma.rcp.app.domain.model.RobotModel;
import com.samma.rcp.app.domain.model.ScenarioType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder // Daha kolay nesne oluşturmak için Builder deseni eklendi
public class SimStatusDto {
    private boolean running;
    private String wsUrl;
    private int port;
    private RobotModel model;
    private ScenarioType scenario;
    private String message;
}