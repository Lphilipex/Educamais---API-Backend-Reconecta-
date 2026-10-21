
package com.educamais.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.educamais.model.Curso;
import com.educamais.service.CursoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cursos")
public class CursoController {

    private final CursoService cursoService;

    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    // Administradores e alunos autenticados podem listar cursos.
    @GetMapping
    public List<Curso> listar() {
        return cursoService.listar();
    }

    // Administradores e alunos autenticados podem consultar um curso.
    @GetMapping("/{id}")
    public ResponseEntity<Curso> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.buscarPorId(id));
    }

    // Somente administrador pode cadastrar.
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Curso> cadastrar(
            @Valid @RequestBody Curso curso) {
        Curso novoCurso = cursoService.cadastrar(curso);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoCurso);
    }

    // Somente administrador pode atualizar.
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Curso> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Curso curso) {
        return ResponseEntity.ok(cursoService.atualizar(id, curso));
    }

    // Somente administrador pode excluir.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        cursoService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
