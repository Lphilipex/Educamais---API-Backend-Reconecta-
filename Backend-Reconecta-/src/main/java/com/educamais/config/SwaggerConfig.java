
package com.educamais.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI configurarSwagger() {

        String nomeEsquema = "Bearer Authentication";

        return new OpenAPI()
                .addSecurityItem(
                        new SecurityRequirement()
                                .addList(nomeEsquema))
                .components(
                        new Components()
                                .addSecuritySchemes(
                                        nomeEsquema,
                                        new SecurityScheme()
                                                .name(nomeEsquema)
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}
