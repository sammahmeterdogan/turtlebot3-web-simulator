package com.samma.rcp.app.service;

import com.samma.rcp.app.domain.entity.SavedMap;
import com.samma.rcp.app.domain.repo.SavedMapRepository;
import com.samma.rcp.app.dto.SavedMapDTO;
import com.samma.rcp.app.mapper.SavedMapMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapService {

    private final SavedMapRepository repo;
    private final SavedMapMapper mapper;

    public SavedMapDTO saveMap(String name) {
        try {
            Path mapsDir = Path.of("ros-stack", "maps");
            Files.createDirectories(mapsDir);
            Path yaml = mapsDir.resolve(name + ".yaml");
            Path pgm  = mapsDir.resolve(name + ".pgm");
            Files.writeString(yaml, "# placeholder map yaml\nimage: " + name + ".pgm\nresolution: 0.05\norigin: [0.0,0.0,0.0]\n");
            if (!Files.exists(pgm)) Files.createFile(pgm);

            SavedMap m = repo.save(SavedMap.builder()
                    .name(name)
                    .filePath(mapsDir.toAbsolutePath().toString())
                    .yamlFilePath(yaml.toAbsolutePath().toString())
                    .pgmFilePath(pgm.toAbsolutePath().toString())
                    .sizeMb(Files.size(pgm) / 1024d / 1024d)
                    .build());

            return mapper.toDto(m);
        } catch (Exception e) {
            throw new RuntimeException("Map save failed", e);
        }
    }

    public List<SavedMapDTO> listMaps() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
