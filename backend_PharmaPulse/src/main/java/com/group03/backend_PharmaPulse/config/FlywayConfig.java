package com.group03.backend_PharmaPulse.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            // This will repair the Flyway schema history table
            flyway.repair();
            // Then perform the migration
            flyway.migrate();
        };
    }
}