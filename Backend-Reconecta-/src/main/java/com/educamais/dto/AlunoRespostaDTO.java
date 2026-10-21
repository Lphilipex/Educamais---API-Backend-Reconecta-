
package com.educamais.dto;

import java.time.LocalDate;

import com.educamais.model.Aluno;

public class AlunoRespostaDTO {

    private Long id;
    private String nome;
    private String email;
    private String matricula;
    private LocalDate dataNascimento;
    private String telefone;
    private String endereco;
    private Boolean ativo;

    public AlunoRespostaDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.email = aluno.getEmail();
        this.matricula = aluno.getMatricula();
        this.dataNascimento = aluno.getDataNascimento();
        this.telefone = aluno.getTelefone();
        this.endereco = aluno.getEndereco();
        this.ativo = aluno.getAtivo();
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

    public String getMatricula() {
        return matricula;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public Boolean getAtivo() {
        return ativo;
    }
}
