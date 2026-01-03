package com.samma.rcp.app.controller;

import com.samma.rcp.app.config.RosDockerProps;
import com.samma.rcp.base.controller.BaseController;
import com.samma.rcp.base.dto.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/visualization")
@RequiredArgsConstructor
public class VisualizationController extends BaseController {

    private final RosDockerProps rosProps;

    @GetMapping("/rviz")
    public ResponseEntity<ResponseDTO<Map<String, String>>> getRvizUrl() {
        String rvizUrl = normalizeRvizUrl(rosProps.getVisualization().getRvizUrl());
        return success(Map.of("url", rvizUrl));
    }

    /**
     * Normalizes the RViz noVNC URL to ensure it points to the correct entry page.
     * 
     * If the URL is missing a path or points to root (/), it appends /vnc.html
     * with autoconnect and resize parameters.
     * 
     * @param url The base URL from configuration
     * @return Normalized URL with correct noVNC entry point
     */
    private String normalizeRvizUrl(String url) {
        if (url == null || url.isBlank()) {
            return "http://localhost:6080/vnc.html?autoconnect=true&resize=remote";
        }

        try {
            URI uri = URI.create(url);
            String path = uri.getPath();
            String query = uri.getQuery();

            // If path is empty, null, or just "/", replace with /vnc.html
            if (path == null || path.isEmpty() || path.equals("/")) {
                StringBuilder normalized = new StringBuilder();
                normalized.append(uri.getScheme()).append("://").append(uri.getAuthority());
                normalized.append("/vnc.html");
                
                // Add query parameters
                if (query != null && !query.isEmpty()) {
                    normalized.append("?").append(query);
                    // Add autoconnect and resize if not present
                    if (!query.contains("autoconnect=")) {
                        normalized.append("&autoconnect=true");
                    }
                    if (!query.contains("resize=")) {
                        normalized.append("&resize=remote");
                    }
                } else {
                    normalized.append("?autoconnect=true&resize=remote");
                }
                
                return normalized.toString();
            }

            // If path already exists and is valid, preserve it but ensure query params
            if (path.startsWith("/vnc") || path.startsWith("/vnc_lite")) {
                StringBuilder normalized = new StringBuilder();
                normalized.append(uri.getScheme()).append("://").append(uri.getAuthority());
                normalized.append(path);
                
                if (query == null || query.isEmpty()) {
                    normalized.append("?autoconnect=true&resize=remote");
                } else {
                    normalized.append("?").append(query);
                    if (!query.contains("autoconnect=")) {
                        normalized.append("&autoconnect=true");
                    }
                    if (!query.contains("resize=")) {
                        normalized.append("&resize=remote");
                    }
                }
                return normalized.toString();
            }

            // Default: append /vnc.html if path doesn't match expected patterns
            return url + (url.endsWith("/") ? "" : "/") + "vnc.html?autoconnect=true&resize=remote";
        } catch (Exception e) {
            // Fallback to safe default
            return "http://localhost:6080/vnc.html?autoconnect=true&resize=remote";
        }
    }
}

