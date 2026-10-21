
package com.educamais.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    description = "Dados utilizados para atualizar um usuário cadastrado"
)
public class UsuarioAtualizacaoDTO {

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
    private String email;

    @Schema(
        description = "Nova senha. Opcional durante a atualização.",
        example = "nova123456",
        accessMode = Schema.AccessMode.WRITE_ONLY
    )
    @Size(
        min = 6,
        message = "A senha deve ter no mínimo 6 caracteres"
    )
    private String senha;

    public UsuarioAtualizacaoDTO() {
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
}
