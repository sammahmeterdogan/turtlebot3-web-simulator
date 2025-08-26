package com.samma.rcp.app.service;

import com.samma.rcp.app.domain.entity.RobotConfig;
import com.samma.rcp.app.domain.model.RobotModel;
import com.samma.rcp.app.domain.repo.RobotConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RobotConfigService {
    private final RobotConfigRepository repo;

    public RobotConfig save(RobotModel model) {
        return repo.save(RobotConfig.builder().model(model).build());
    }

    public Optional<RobotConfig> lastFor(RobotModel model) {
        return repo.findTopByModelOrderByCreatedAtDesc(model);
    }
}
