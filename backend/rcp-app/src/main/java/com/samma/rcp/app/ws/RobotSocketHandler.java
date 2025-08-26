package com.samma.rcp.app.ws;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class RobotSocketHandler implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/robot").setAllowedOriginPatterns("*").withSockJS();
    }

    @Controller
    @RequiredArgsConstructor
    public static class WebSocketController {
        private final SimpMessagingTemplate mq;
        private final ObjectMapper om;

        public void broadcastStatus(Object status) { mq.convertAndSend("/topic/status", status); }
        public void broadcastTelemetry(Map<String, Object> telemetry) { mq.convertAndSend("/topic/telemetry", telemetry); }

        @MessageMapping("/command")
        @SendTo("/topic/response")
        public Map<String, Object> handle(Map<String, Object> cmd) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("echo", cmd.get("type"));
            return res;
        }
    }
}
