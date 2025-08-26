package com.samma.rcp.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "ros")
public class RosDockerProps {

    private Docker docker = new Docker();
    private Bridge bridge = new Bridge();
    private Video video = new Video();
    private Simulation simulation = new Simulation();

    @Data public static class Docker { private String host; private String composeFile; private String network; }
    @Data public static class Bridge { private String url; private int reconnectInterval; }
    @Data public static class Video  { private String streamUrl; }
    @Data public static class Simulation { private String defaultModel; private int startupTimeout; private int healthCheckInterval; }
}
