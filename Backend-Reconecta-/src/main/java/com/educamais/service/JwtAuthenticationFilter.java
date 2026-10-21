
package com.educamais.service;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.educamais.model.Usuario;
import com.educamais.repository.UsuarioRepository;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String autorizacao = request.getHeader("Authorization");

        if (autorizacao == null || !autorizacao.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = autorizacao.substring(7);

        try {
            if (jwtService.tokenValido(token)) {

                String email = jwtService.extrairEmail(token);

                Usuario usuario = usuarioRepository.findByEmail(email)
                        .orElse(null);

                if (usuario != null
                        && Boolean.TRUE.equals(usuario.getAtivo())
                        && usuario.getPerfil() != null) {

                    UsernamePasswordAuthenticationToken autenticacao =
                            new UsernamePasswordAuthenticationToken(
                                    usuario.getEmail(),
                                    null,
                                    List.of(
                                            new SimpleGrantedAuthority(
                                                    "ROLE_" + usuario.getPerfil().name())
                                    )
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(autenticacao);

                } else {
                    SecurityContextHolder.clearContext();
                }
            } else {
                SecurityContextHolder.clearContext();
            }

        } catch (JwtException | IllegalArgumentException e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
