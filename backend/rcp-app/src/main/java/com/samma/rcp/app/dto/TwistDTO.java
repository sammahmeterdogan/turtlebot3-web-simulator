package com.samma.rcp.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TwistDTO {
    @NotNull private Double linear;   // m/s
    @NotNull private Double angular;  // rad/s
    private String topic;             // default: /cmd_vel
}
