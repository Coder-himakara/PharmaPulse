package com.group03.backend_PharmaPulse.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import static com.group03.backend_PharmaPulse.user.api.enumeration.Permission.ADMIN_CREATE;
import static com.group03.backend_PharmaPulse.user.api.enumeration.Role.ADMIN;

@Configuration
@EnableWebMvc
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtFilter jwtFilter;
    private final BasicAuthenticationEntryPoint basicAuthenticationEntryPoint;

    public SecurityConfig(UserDetailsService userDetailsService, JwtFilter jwtFilter,
                          BasicAuthenticationEntryPoint basicAuthenticationEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
        this.basicAuthenticationEntryPoint = basicAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http

                .authorizeHttpRequests(request ->request
                        .requestMatchers(HttpMethod.POST,"/api/users/login","api/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/logout").permitAll()
                        .requestMatchers("/api/users/register").hasRole(ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/api/users/register").hasAuthority(ADMIN_CREATE.name())
                        .requestMatchers("/swagger-ui/index.html").permitAll()
                        .requestMatchers("/ws/**").permitAll() // Handled in interceptor. For websocket
                        .requestMatchers(HttpMethod.POST, "/api/customer-groups/add").permitAll() // Permit this endpoint

                        .anyRequest().authenticated())
                .cors(cors -> cors.configure(http))
                .csrf(customizer -> customizer.disable())
                .httpBasic(httpBasic -> httpBasic
                        .authenticationEntryPoint(this.basicAuthenticationEntryPoint))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}