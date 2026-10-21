
package com.educamais.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @Schema(
        description = "Identificador único do usuário",
        accessMode = Schema.AccessMode.READ_ONLY
    )
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(
        description = "Nome completo do usuário",
        example = "Maria Silva"
    )
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Schema(
        description = "E-mail do usuário",
        example = "maria@example.com"
    )
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Digite um e-mail válido")
    @Column(unique = true)
    private String email;

    @Schema(
        description = "Senha informada no cadastro. Nunca será retornada nas respostas.",
        example = "senha123",
        accessMode = Schema.AccessMode.WRITE_ONLY
    )
    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String senha;

    @NotNull(message = "O status do usuário é obrigatório")
    @Column(nullable = false)
    private Boolean ativo = true;

    @Schema(
        description = "Perfil de acesso do usuário",
        example = "ALUNO",
        accessMode = Schema.AccessMode.READ_ONLY
    )
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PerfilUsuario perfil = PerfilUsuario.ALUNO;

    public Usuario() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilUsuario perfil) {
        this.perfil = perfil;
    }
}
