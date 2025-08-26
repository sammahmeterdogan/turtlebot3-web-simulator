package com.samma.rcp.app.controller;

import com.samma.rcp.app.domain.model.ScenarioType;
import com.samma.rcp.base.controller.BaseController;
import com.samma.rcp.base.dto.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/examples")
public class ExampleController extends BaseController {

    @GetMapping
    public ResponseEntity<ResponseDTO<List<Map<String, String>>>> list() {
        // Basit sabit liste (Flyway ile tablo kullanacaksan burayı repo ile değiştir)
        List<Map<String, String>> items = new ArrayList<>();
        items.add(Map.of("key","TELEOP","title","Teleoperation","category","BASIC","difficulty","EASY"));
        items.add(Map.of("key","SLAM","title","SLAM Mapping","category","MAPPING","difficulty","MEDIUM"));
        items.add(Map.of("key","NAVIGATION","title","Navigation","category","NAVIGATION","difficulty","MEDIUM"));
        return success(items);
    }

    @GetMapping("/types")
    public ResponseEntity<ResponseDTO<ScenarioType[]>> types() {
        return success(ScenarioType.values());
    }
}
