package com.samma.rcp.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GoalPoseDTO {
    @NotNull private Double x;
    @NotNull private Double y;
    @NotNull private Double theta; // rad
    private String frameId;        // default: map
}
