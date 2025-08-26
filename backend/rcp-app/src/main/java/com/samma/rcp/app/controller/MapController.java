package com.samma.rcp.app.controller;

import com.samma.rcp.app.dto.SavedMapDTO;
import com.samma.rcp.app.service.MapService;
import com.samma.rcp.base.controller.BaseController;
import com.samma.rcp.base.dto.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class MapController extends BaseController {

    private final MapService maps;

    @PostMapping("/save")
    public ResponseEntity<ResponseDTO<SavedMapDTO>> save(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "map_" + System.currentTimeMillis());
        return created(maps.saveMap(name));
    }

    @GetMapping("/list")
    public ResponseEntity<ResponseDTO<List<SavedMapDTO>>> list() {
        return success(maps.listMaps());
    }
}
