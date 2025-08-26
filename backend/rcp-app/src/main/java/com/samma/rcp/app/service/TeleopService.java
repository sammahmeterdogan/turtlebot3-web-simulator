package com.samma.rcp.app.service;

import com.samma.rcp.app.dto.GoalPoseDTO;
import com.samma.rcp.app.dto.TwistDTO;
import com.samma.rcp.app.orchestration.RosBridgeClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeleopService {
    private final RosBridgeClient ros;

    public void sendTwist(TwistDTO t) { ros.publishTwist(t); }
    public void sendGoal(GoalPoseDTO g) { ros.sendGoal(g); }
}
