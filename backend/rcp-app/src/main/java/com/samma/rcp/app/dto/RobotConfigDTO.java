package com.samma.rcp.app.dto;

import com.samma.rcp.app.domain.model.RobotModel;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RobotConfigDTO {
    private Long id;
    @NotNull private RobotModel model;
}
