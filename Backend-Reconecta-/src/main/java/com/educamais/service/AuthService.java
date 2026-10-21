
package com.educamais.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.educamais.dto.LoginDTO;
import com.educamais.dto.LoginRespostaDTO;
import com.educamais.model.Usuario;
import com.educamais.repository.UsuarioRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginRespostaDTO login(LoginDTO dados) {

        Usuario usuario = usuarioRepository
                .findByEmailAndAtivoTrue(dados.getEmail())
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "E-mail ou senha inválidos"
                        ));

        boolean senhaValida = passwordEncoder.matches(
                dados.getSenha(),
                usuario.getSenha()
        );

        if (!senhaValida) {
            throw new BadCredentialsException(
                    "E-mail ou senha inválidos"
            );
        }

        String token = jwtService.gerarToken(
                usuario.getEmail()
        );

        return new LoginRespostaDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                token,
                usuario.getPerfil()
        );
    }
}
