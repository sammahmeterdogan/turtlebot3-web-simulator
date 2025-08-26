package com.samma.rcp.app.controller;

import com.samma.rcp.app.dto.GoalPoseDTO;
import com.samma.rcp.app.dto.TwistDTO;
import com.samma.rcp.app.service.TeleopService;
import com.samma.rcp.base.controller.BaseController;
import com.samma.rcp.base.dto.ResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TeleopController extends BaseController {

    private final TeleopService teleop;

    @PostMapping("/teleop/twist")
    public ResponseEntity<ResponseDTO<String>> twist(@Valid @RequestBody TwistDTO dto) {
        teleop.sendTwist(dto);
        return success("twist_sent");
    }

    @PostMapping("/nav/goal")
    public ResponseEntity<ResponseDTO<String>> goal(@Valid @RequestBody GoalPoseDTO dto) {
        teleop.sendGoal(dto);
        return success("goal_sent");
    }
}
