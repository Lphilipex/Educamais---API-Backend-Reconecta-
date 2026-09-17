package com.educamais.controller;

import com.educamais.exception.RecursoNaoEncontradoException;
import com.educamais.model.Usuario;
import com.educamais.repository.UsuarioRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Usuário não encontrado"
                ));

        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(
            @Valid @RequestBody Usuario usuario) {

        Usuario novoUsuario = repository.save(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Usuario usuario) {

        Usuario usuarioExistente = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Usuário não encontrado"
                ));

        usuarioExistente.setNome(usuario.getNome());
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setSenha(usuario.getSenha());

        Usuario usuarioAtualizado = repository.save(usuarioExistente);

        return ResponseEntity.ok(usuarioAtualizado);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Usuário não encontrado"
                ));

        repository.delete(usuario);

        return ResponseEntity.noContent().build();
    }
}
