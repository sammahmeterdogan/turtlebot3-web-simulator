package com.samma.rcp.app.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI api() {
        return new OpenAPI()
            .info(new Info()
                .title("TurtleBot3 Simulation API")
                .version("1.0.0")
                .description("Web-based TB3 simulation platform")
                .contact(new Contact().name("SAMMA").email("support@samma.com")))
            .servers(List.of(new Server().url("http://localhost:8080").description("Local")));
    }
}
