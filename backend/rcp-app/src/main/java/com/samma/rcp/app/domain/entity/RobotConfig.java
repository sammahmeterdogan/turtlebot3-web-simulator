package com.samma.rcp.app.domain.entity;

import com.samma.rcp.app.domain.model.RobotModel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "robot_config")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RobotConfig {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private RobotModel model;
    @Column(name="created_at", nullable=false) private LocalDateTime createdAt;
    @Column(name="updated_at") private LocalDateTime updatedAt;
    @PrePersist protected void onCreate(){ createdAt = LocalDateTime.now(); }
    @PreUpdate  protected void onUpdate(){ updatedAt = LocalDateTime.now(); }
}
