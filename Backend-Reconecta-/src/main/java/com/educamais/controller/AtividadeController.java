package com.educamais.controller;

import com.educamais.exception.RecursoNaoEncontradoException;
import com.educamais.model.Atividade;
import com.educamais.model.Disciplina;
import com.educamais.repository.AtividadeRepository;
import com.educamais.repository.DisciplinaRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atividades")
@CrossOrigin(origins = "*") // 👈 Anotação de CORS adicionada aqui!
public class AtividadeController {

    private final AtividadeRepository repository;
    private final DisciplinaRepository disciplinaRepository;

    public AtividadeController(
            AtividadeRepository repository,
            DisciplinaRepository disciplinaRepository) {

        this.repository = repository;
        this.disciplinaRepository = disciplinaRepository;
    }

    @GetMapping
    public List<Atividade> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atividade> buscarPorId(@PathVariable Long id) {
        Atividade atividade = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Atividade não encontrada"
                ));
        return ResponseEntity.ok(atividade);
    }

    @PostMapping
    public ResponseEntity<Atividade> cadastrar(
            @Valid @RequestBody Atividade atividade) {

        Long disciplinaId = atividade.getDisciplina().getId();

        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Disciplina não encontrada"
                ));

        atividade.setDisciplina(disciplina);

        Atividade novaAtividade = repository.save(atividade);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaAtividade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atividade> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Atividade atividade) {

        Atividade existente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Atividade não encontrada"
                ));

        existente.setTitulo(atividade.getTitulo());
        existente.setDescricao(atividade.getDescricao());
        existente.setDataEntrega(atividade.getDataEntrega());

        if (atividade.getDisciplina() != null) {
            Long disciplinaId = atividade.getDisciplina().getId();
            Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                            "Disciplina não encontrada"
                    ));
            existente.setDisciplina(disciplina);
        }

        Atividade atualizada = repository.save(existente);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Atividade atividade = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Atividade não encontrada"
                ));

        repository.delete(atividade);
        return ResponseEntity.noContent().build();
    }
}