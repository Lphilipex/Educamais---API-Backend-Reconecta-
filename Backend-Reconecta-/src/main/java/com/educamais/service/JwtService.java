
package com.educamais.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey chaveSecreta;
    private final long tempoExpiracao;

    public JwtService(
            @Value("${educamais.jwt.secret}") String segredo,
            @Value("${educamais.jwt.expiration:3600000}") long tempoExpiracao) {

        byte[] chaveBytes = Decoders.BASE64.decode(segredo);

        this.chaveSecreta = Keys.hmacShaKeyFor(chaveBytes);
        this.tempoExpiracao = tempoExpiracao;
    }

    public String gerarToken(String email) {

        Date agora = new Date();

        Date expiracao = new Date(
                agora.getTime() + tempoExpiracao
        );

        return Jwts.builder()
                .subject(email)
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(chaveSecreta)
                .compact();
    }

    public String extrairEmail(String token) {

        return extrairClaims(token).getSubject();
    }

    public boolean tokenValido(String token) {

        try {
            Claims claims = extrairClaims(token);

            return claims.getExpiration() != null
                    && claims.getExpiration().after(new Date());

        } catch (Exception e) {
            return false;
        }
    }

    private Claims extrairClaims(String token) {

        return Jwts.parser()
                .verifyWith(chaveSecreta)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
