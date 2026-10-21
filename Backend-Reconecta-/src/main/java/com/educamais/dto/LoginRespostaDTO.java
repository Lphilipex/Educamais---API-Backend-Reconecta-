
package com.educamais.dto;

import com.educamais.model.PerfilUsuario;

public class LoginRespostaDTO {

    private Long id;
    private String nome;
    private String email;
    private String token;
    private PerfilUsuario perfil;

    public LoginRespostaDTO(
            Long id,
            String nome,
            String email,
            String token,
            PerfilUsuario perfil) {

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.token = token;
        this.perfil = perfil;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }
}
