package com.group03.backend_PharmaPulse.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration {
    private static final String[] ALLOWED_METHODS = {
            "GET", "POST", "PUT", "DELETE"
    };

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods(ALLOWED_METHODS)
                        .allowedOrigins("*")
                        .allowedHeaders("*");
            }
        };
    }
}
