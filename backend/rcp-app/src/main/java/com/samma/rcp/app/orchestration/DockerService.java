package com.samma.rcp.app.orchestration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.Duration;

/**
 * Sadeçe sistemde kurulu docker/compose CLI'larını çağırır.
 * CI/CD ve farklı kullanıcılar için path bağımsızdır; compose "-f <dosya>" ile veriliyor.
 */
@Component
public class DockerService {
    private static final Logger log = LoggerFactory.getLogger(DockerService.class);

    /** docker compose up -d */
    public void composeUp(Path composeFile) {
        run("docker","compose","-f", composeFile.toString(), "up", "-d");
    }

    /** docker compose down */
    public void composeDown(Path composeFile) {
        run("docker","compose","-f", composeFile.toString(), "down");
    }

    /** Belirtilen host:port dinlemeye geçti mi? */
    public boolean waitForPort(String host, int port, Duration timeout) {
        long deadline = System.nanoTime() + timeout.toNanos();
        while (System.nanoTime() < deadline) {
            try (Socket s = new Socket()) {
                s.connect(new InetSocketAddress(host, port), 1000);
                return true;
            } catch (IOException ignored) {
                try { Thread.sleep(300); } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt(); return false;
                }
            }
        }
        return false;
    }

    private void run(String... cmd) {
        try {
            Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
            String out = new String(p.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int code = p.waitFor();
            log.info("[compose] {}", out.trim()); // Log: UI istemez; opsiyonel saklanır
            if (code != 0) throw new IllegalStateException("Process exit: " + code);
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
