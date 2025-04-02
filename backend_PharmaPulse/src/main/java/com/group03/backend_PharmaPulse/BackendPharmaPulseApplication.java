package com.group03.backend_PharmaPulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import org.springframework.web.servlet.config.annotation.EnableWebMvc;


@SpringBootApplication
@EnableWebMvc
@EnableTransactionManagement
@EnableCaching
@EnableScheduling
public class BackendPharmaPulseApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendPharmaPulseApplication.class, args);
	}
}
