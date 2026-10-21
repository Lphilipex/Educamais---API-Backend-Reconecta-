package com.educamais.controller;

import com.educamais.exception.RecursoNaoEncontradoException;
import com.educamais.model.Disciplina;
import com.educamais.model.Material;
import com.educamais.repository.DisciplinaRepository;
import com.educamais.repository.MaterialRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materiais")
public class MaterialController {

    private final MaterialRepository repository;
    private final DisciplinaRepository disciplinaRepository;

    public MaterialController(
            MaterialRepository repository,
            DisciplinaRepository disciplinaRepository) {

        this.repository = repository;
        this.disciplinaRepository = disciplinaRepository;
    }

    @GetMapping
    public List<Material> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Material> buscar(@PathVariable Long id) {

        Material material = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Material não encontrado"
                ));

        return ResponseEntity.ok(material);
    }

    @PostMapping
    public ResponseEntity<Material> cadastrar(
            @Valid @RequestBody Material material) {

        Long disciplinaId = material.getDisciplina().getId();

        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Disciplina não encontrada"
                ));

        material.setDisciplina(disciplina);

        Material novoMaterial = repository.save(material);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoMaterial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Material> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Material material) {

        Material existente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Material não encontrado"
                ));

        existente.setTitulo(material.getTitulo());
        existente.setDescricao(material.getDescricao());
        existente.setUrl(material.getUrl());

        if (material.getDisciplina() != null) {

            Long disciplinaId = material.getDisciplina().getId();

            Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                            "Disciplina não encontrada"
                    ));

            existente.setDisciplina(disciplina);
        }

        return ResponseEntity.ok(repository.save(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        Material material = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Material não encontrado"
                ));

        repository.delete(material);

        return ResponseEntity.noContent().build();
    }
}