
package com.educamais.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.educamais.service.JwtAuthenticationFilter;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity
public class SegurancaConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SegurancaConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(
                        List.of("http://localhost:5173"));

                config.setAllowedMethods(
                        List.of("GET", "POST", "PUT", "PATCH",
                                "DELETE", "OPTIONS"));

                config.setAllowedHeaders(List.of("*"));

                return config;
            }))

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers(
                        "/auth/login",
                        "/swagger-ui/**",
                        "/v3/api-docs/**"
                ).permitAll()


                // Listagem de alunos: somente administradores.
                .requestMatchers(
                        HttpMethod.GET, "/alunos"
                ).hasRole("ADMIN")

                // Cadastro público de aluno.
                .requestMatchers(
                        HttpMethod.POST, "/alunos"
                ).permitAll()

                // Vinculação de conta a aluno existente:
                // somente administradores.
                .requestMatchers(
                        HttpMethod.POST, "/alunos/*/conta"
                ).hasRole("ADMIN")


                .requestMatchers(
                        HttpMethod.POST, "/alunos",
                        "/alunos/*/conta"
                ).hasRole("ADMIN")

                // Alterações administrativas de alunos.
                .requestMatchers(
                        HttpMethod.PUT, "/alunos/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                        HttpMethod.PATCH, "/alunos/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                        HttpMethod.DELETE, "/alunos/**"
                ).hasRole("ADMIN")

                // Consultas individuais: autenticados.
                // O controller ainda precisará validar a propriedade.
                .requestMatchers(
                        HttpMethod.GET, "/alunos/*"
                ).hasAnyRole("ADMIN", "ALUNO")

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
