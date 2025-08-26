package com.samma.rcp.app.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "example_scenario")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ExampleScenario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true, nullable = false) private String key;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name="launch_args", columnDefinition = "TEXT") private String launchArgs;
    private String category;
    private String difficulty;
    @Builder.Default private Boolean enabled = true;
    @Column(name="created_at", nullable=false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate(){ createdAt = LocalDateTime.now(); }
}
