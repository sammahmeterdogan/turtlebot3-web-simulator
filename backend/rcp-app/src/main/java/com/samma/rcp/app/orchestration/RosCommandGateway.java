package com.samma.rcp.app.orchestration;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class RosCommandGateway {

    private final RosBridgeClient ros;

    public void advertise(String topic, String type) {
        // basit proxy — RosBridgeClient içinde advertise/publish private.
        // Gerekirse RosBridgeClient'a public metod ekleyip buradan çağırabilirsin.
        // Şimdilik Twist/Goal gibi spesifik komutlar RosBridgeClient tarafından gönderiliyor.
    }

    public void publish(String topic, Map<String, Object> message) {
        // aynı not: generic publish ihtiyacında RosBridgeClient'a public publish ekleyebilirsin.
        throw new UnsupportedOperationException("Generic publish is not exposed yet. Use TeleopService / Simulation APIs.");
    }
}
