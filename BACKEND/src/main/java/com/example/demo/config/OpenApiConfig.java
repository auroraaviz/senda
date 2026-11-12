package com.example.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sendaOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Senda API")
                .description("API REST para organizar proyectos académicos por fases, con progreso ponderado y estados automáticos.")
                .version("1.0"));
    }
}