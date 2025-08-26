package com.samma.rcp.app.controller;

import com.samma.rcp.app.domain.model.*;
import com.samma.rcp.app.dto.*;
import com.samma.rcp.app.service.SimulationService;
import com.samma.rcp.base.controller.BaseController;
import com.samma.rcp.base.dto.ResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sim")
@RequiredArgsConstructor
public class SimulationController extends BaseController {

    private final SimulationService service;

    @PostMapping("/start")
    public ResponseEntity<ResponseDTO<SimulationStatusDTO>> start(@Valid @RequestBody SimulationStartRequest req) {
        return success(service.start(req.getModel(), req.getScenario()), "Simulation starting");
    }

    @PostMapping("/stop")
    public ResponseEntity<ResponseDTO<SimulationStatusDTO>> stop() {
        return success(service.stop(), "Stopping simulation");
    }

    @GetMapping("/status")
    public ResponseEntity<ResponseDTO<SimulationStatusDTO>> status() {
        return success(service.status());
    }

    @GetMapping("/models")
    public ResponseEntity<ResponseDTO<RobotModel[]>> models() {
        return success(RobotModel.values());
    }

    @GetMapping("/scenarios")
    public ResponseEntity<ResponseDTO<ScenarioType[]>> scenarios() {
        return success(ScenarioType.values());
    }
}
