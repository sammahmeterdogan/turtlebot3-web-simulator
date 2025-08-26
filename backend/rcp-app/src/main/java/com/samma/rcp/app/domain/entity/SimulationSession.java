package com.samma.rcp.app.domain.entity;

import com.samma.rcp.app.domain.model.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "simulation_session")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SimulationSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @Enumerated(EnumType.STRING) @Column(nullable=false) private RobotModel model;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private ScenarioType scenario;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private SimulationStatus status;

    @Column(name="started_at", nullable=false) private LocalDateTime startedAt;
    @Column(name="ended_at") private LocalDateTime endedAt;

    @Column(name="ros_bridge_url") private String rosBridgeUrl;
    @Column(name="video_url") private String videoUrl;
    @Column(name="error_message", columnDefinition = "TEXT") private String errorMessage;

    @Column(name="created_at", nullable=false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate(){ createdAt = LocalDateTime.now(); if (startedAt == null) startedAt = LocalDateTime.now(); }
}
