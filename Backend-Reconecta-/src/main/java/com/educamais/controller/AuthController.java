
package com.educamais.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.educamais.dto.LoginDTO;
import com.educamais.dto.LoginRespostaDTO;
import com.educamais.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginRespostaDTO> login(
            @Valid @RequestBody LoginDTO dados) {

        LoginRespostaDTO resposta = authService.login(dados);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(resposta);
    }
}
