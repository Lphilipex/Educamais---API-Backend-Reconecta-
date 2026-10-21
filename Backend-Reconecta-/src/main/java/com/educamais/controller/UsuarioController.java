
package com.educamais.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.educamais.dto.UsuarioAtualizacaoDTO;
import com.educamais.model.Usuario;
import com.educamais.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
    name = "Usuários",
    description = "Operações de cadastro, consulta, atualização e exclusão de usuários"
)
@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(
        summary = "Listar usuários",
        description = "Retorna a lista de usuários cadastrados."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    })
    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @Operation(
        summary = "Buscar usuário por ID",
        description = "Busca os dados de um usuário específico pelo seu identificador."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @Operation(
        summary = "Cadastrar usuário",
        description = "Cadastra um novo usuário com senha protegida por BCrypt."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Usuário cadastrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "409", description = "E-mail já cadastrado")
    })
    @PostMapping
    public ResponseEntity<?> cadastrar(
            @Valid @RequestBody Usuario usuario) {

        if (usuarioService.existeEmail(usuario.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "erro",
                            "Este e-mail já está cadastrado."
                    ));
        }

        Usuario novoUsuario = usuarioService.cadastrar(usuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(novoUsuario);
    }

    @Operation(
        summary = "Atualizar usuário",
        description = "Atualiza nome e e-mail. A senha é opcional."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "409", description = "E-mail já cadastrado para outro usuário")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioAtualizacaoDTO dados) {

        Usuario usuarioAtualizado = usuarioService.atualizar(id, dados);

        return ResponseEntity.ok(usuarioAtualizado);
    }

    @Operation(
        summary = "Desativar usuário",
        description = "Desativa a conta sem apagar o registro do banco de dados."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Usuário desativado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        usuarioService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
