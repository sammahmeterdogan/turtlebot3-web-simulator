package com.samma.rcp.app.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SavedMapDTO {
    private Long id;
    private String name;
    private String filePath;
    private String pgmFilePath;
    private String yamlFilePath;
    private Double sizeMb;
    private Double resolution;
    private Integer width;
    private Integer height;
}
