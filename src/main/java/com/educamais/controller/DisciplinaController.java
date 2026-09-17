package com.educamais.controller;

import com.educamais.exception.RecursoNaoEncontradoException;
import com.educamais.model.Disciplina;
import com.educamais.model.Usuario;
import com.educamais.repository.DisciplinaRepository;
import com.educamais.repository.UsuarioRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {

    private final DisciplinaRepository repository;
    private final UsuarioRepository usuarioRepository;

    public DisciplinaController(
            DisciplinaRepository repository,
            UsuarioRepository usuarioRepository) {

        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Disciplina> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> buscar(@PathVariable Long id) {

        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Disciplina não encontrada"
                ));

        return ResponseEntity.ok(disciplina);
    }

    @PostMapping
    public ResponseEntity<Disciplina> cadastrar(
            @Valid @RequestBody Disciplina disciplina) {

        Long usuarioId = disciplina.getUsuario().getId();

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Usuário não encontrado"
                ));

        disciplina.setUsuario(usuario);

        Disciplina novaDisciplina = repository.save(disciplina);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaDisciplina);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Disciplina> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Disciplina disciplina) {

        Disciplina existente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Disciplina não encontrada"
                ));

        existente.setNome(disciplina.getNome());
        existente.setDescricao(disciplina.getDescricao());

        if (disciplina.getUsuario() != null) {

            Long usuarioId = disciplina.getUsuario().getId();

            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                            "Usuário não encontrado"
                    ));

            existente.setUsuario(usuario);
        }

        return ResponseEntity.ok(repository.save(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Disciplina não encontrada"
                ));

        repository.delete(disciplina);

        return ResponseEntity.noContent().build();
    }
}
