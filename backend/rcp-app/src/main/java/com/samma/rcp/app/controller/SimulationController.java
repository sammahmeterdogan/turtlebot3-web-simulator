package com.samma.rcp.app.controller;

import com.samma.rcp.app.domain.SimStatusDto;
import com.samma.rcp.app.service.SimulationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sim")
public class SimulationController {

    private final SimulationService service;

    public SimulationController(SimulationService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public SimStatusDto start() {
        return service.start();
    }

    @PostMapping("/stop")
    public SimStatusDto stop() {
        return service.stop();
    }

    @GetMapping("/status")
    public SimStatusDto status() {
        return service.status();
    }
}
