package com.samma.rcp.app.orchestration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DockerService {
    private static final Logger log = LoggerFactory.getLogger(DockerService.class);

    /** docker compose -f <file> up -d [services...] */
    public void composeUp(Path composeFile, String... services) {
        List<String> command = new ArrayList<>(Arrays.asList("docker", "compose", "-f", composeFile.toString(), "up", "-d", "--build"));
        if (services != null && services.length > 0) {
            command.addAll(Arrays.asList(services));
        }
        run(command.toArray(new String[0]));
    }

    /** docker compose down */
    public void composeDown(Path composeFile) {
        run("docker", "compose", "-f", composeFile.toString(), "down", "--remove-orphans");
    }

    public boolean isContainerRunning(String containerName) {
        try {
            ProcessBuilder pb = new ProcessBuilder("docker", "ps", "--filter", "name=" + containerName, "--filter", "status=running", "--format", "{{.Names}}");
            Process p = pb.start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
                return reader.lines().anyMatch(line -> line.contains(containerName));
            }
        } catch (IOException e) {
            log.error("Konteyner durumu kontrol edilemedi: " + containerName, e);
            return false;
        }
    }

    /** Belirtilen host:port dinlemeye geçti mi? */
    public boolean waitForPort(String host, int port, Duration timeout) {
        long deadline = System.nanoTime() + timeout.toNanos();
        while (System.nanoTime() < deadline) {
            try (Socket s = new Socket()) {
                s.connect(new InetSocketAddress(host, port), 1000);
                return true;
            } catch (IOException ignored) {
                try { Thread.sleep(500); } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt(); return false;
                }
            }
        }
        return false;
    }

    private void run(String... cmd) {
        try {
            log.info("Executing Docker command: {}", String.join(" ", cmd));
            Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
            String out = new String(p.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int code = p.waitFor();
            if (!out.isBlank()) {
                log.info("[compose] {}", out.trim());
            }
            if (code != 0) throw new IllegalStateException("Process exit code: " + code + " for command: " + String.join(" ", cmd));
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}