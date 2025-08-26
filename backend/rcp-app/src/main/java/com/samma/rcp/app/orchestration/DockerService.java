package com.samma.rcp.app.orchestration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DockerService {

    public void composeUp(String composeFile, Map<String, String> env) {
        run(List.of("docker", "compose", "-f", composeFile, "up", "-d"), env);
    }

    public void composeDown(String composeFile, Map<String, String> env) {
        run(List.of("docker", "compose", "-f", composeFile, "down"), env);
    }

    public boolean waitForPort(String host, int port, Duration timeout) {
        long end = System.currentTimeMillis() + timeout.toMillis();
        while (System.currentTimeMillis() < end) {
            try (Socket s = new Socket()) {
                s.connect(new InetSocketAddress(host, port), 1500);
                return true;
            } catch (Exception ignored) {
                try { Thread.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            }
        }
        return false;
    }

    private void run(List<String> cmd, Map<String, String> env) {
        try {
            log.info("Running: {}", String.join(" ", cmd));
            ProcessBuilder pb = new ProcessBuilder(cmd);
            if (env != null) pb.environment().putAll(env);
            pb.redirectErrorStream(true);
            Process p = pb.start();
            try (BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
                String line;
                while ((line = r.readLine()) != null) log.info("[compose] {}", line);
            }
            int code = p.waitFor();
            if (code != 0) throw new IllegalStateException("Process exit: " + code);
        } catch (Exception e) {
            throw new RuntimeException("Docker compose failed", e);
        }
    }
}
