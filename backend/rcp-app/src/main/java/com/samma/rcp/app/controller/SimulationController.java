package com.samma.rcp.app.controller;

import com.samma.rcp.app.dto.SimStatusDto;
import com.samma.rcp.app.dto.SimulationStartRequest;
import com.samma.rcp.app.service.SimulationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sim")
public class SimulationController {

    private final SimulationService service;

    public SimulationController(SimulationService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public ResponseEntity<SimStatusDto> start(@Valid @RequestBody SimulationStartRequest request) {
        return ResponseEntity.ok(service.start(request));
    }

    @PostMapping("/stop")
    public ResponseEntity<SimStatusDto> stop() {
        return ResponseEntity.ok(service.stop());
    }

    @GetMapping("/status")
    public ResponseEntity<SimStatusDto> status() {
        return ResponseEntity.ok(service.getStatus());
    }
}