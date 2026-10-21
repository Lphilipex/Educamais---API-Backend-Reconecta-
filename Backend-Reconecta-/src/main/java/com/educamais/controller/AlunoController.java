
package com.educamais.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.educamais.dto.AlunoCadastroDTO;
import com.educamais.dto.AlunoRespostaDTO;
import com.educamais.model.Aluno;
import com.educamais.model.Usuario;
import com.educamais.service.AlunoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
    name = "Alunos",
    description = "Cadastro, consulta, atualização e exclusão de alunos"
)
@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    private final AlunoService service;

    public AlunoController(AlunoService service) {
        this.service = service;
    }

    // Listar todos os alunos
    @GetMapping
    @Operation(
        summary = "Listar alunos",
        description = "Retorna todos os alunos cadastrados."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Lista retornada com sucesso"
    )
    public List<AlunoRespostaDTO> listar() {
        return service.listar()
                .stream()
                .map(AlunoRespostaDTO::new)
                .toList();
    }

    // Buscar aluno por ID
    @GetMapping("/{id}")
    @Operation(
        summary = "Buscar aluno por ID",
        description = "Administradores podem consultar qualquer aluno. Alunos só podem consultar o próprio registro."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Aluno encontrado"),
        @ApiResponse(responseCode = "403", description = "Acesso negado"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<?> buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Aluno aluno = service.buscarPorId(id);

        boolean administrador = authentication.getAuthorities().stream()
                .anyMatch(autoridade ->
                        autoridade.getAuthority().equals("ROLE_ADMIN"));

        if (!administrador) {
            String emailAutenticado = authentication.getName();

            boolean pertenceAoUsuario = aluno.getUsuario() != null
                    && emailAutenticado.equalsIgnoreCase(
                            aluno.getUsuario().getEmail());

            if (!pertenceAoUsuario) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "erro",
                                "Você não tem permissão para consultar este aluno."
                        ));
            }
        }

        return ResponseEntity.ok(new AlunoRespostaDTO(aluno));
    }

    // Buscar o perfil do aluno autenticado
    @GetMapping("/meu-perfil")
    @Operation(
        summary = "Consultar meu perfil",
        description = "Retorna o aluno vinculado ao usuário autenticado."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Perfil encontrado"),
        @ApiResponse(responseCode = "404", description = "Nenhum aluno vinculado à conta")
    })
    public ResponseEntity<?> buscarMeuPerfil(
            Authentication authentication) {

        String emailAutenticado = authentication.getName();

        return service.buscarPorEmailDoUsuario(emailAutenticado)
                .<ResponseEntity<?>>map(aluno ->
                        ResponseEntity.ok(
                                new AlunoRespostaDTO(aluno)
                        )
                )
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "erro",
                                "Não existe um aluno vinculado a esta conta."
                        )));
    }

    // Cadastrar aluno com conta de usuário obrigatória
    @PostMapping
    @Operation(
        summary = "Cadastrar aluno",
        description = "Cadastra um aluno e cria sua conta de usuário."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Aluno cadastrado"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "409", description = "E-mail ou matrícula já cadastrados")
    })
    public ResponseEntity<?> cadastrar(
            @Valid @RequestBody AlunoCadastroDTO aluno) {

        if (service.existeEmail(aluno.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "erro",
                            "Este e-mail já está cadastrado para outro aluno."
                    ));
        }

        if (service.existeMatricula(aluno.getMatricula())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "erro",
                            "Esta matrícula já está cadastrada."
                    ));
        }

        Aluno novoAluno = service.cadastrar(aluno);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AlunoRespostaDTO(novoAluno));
    }

    // Criar conta de usuário para um aluno existente
    @PostMapping("/{id}/conta")
    @Operation(
        summary = "Criar conta para aluno",
        description = "Cria uma conta de usuário e vincula ao aluno informado."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Conta criada e vinculada"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado"),
        @ApiResponse(responseCode = "409", description = "Aluno já possui conta ou e-mail já cadastrado")
    })
    public ResponseEntity<?> criarContaEVincular(
            @PathVariable Long id,
            @Valid @RequestBody Usuario dadosUsuario) {

        try {
        	Aluno alunoAtualizado =
        	        service.criarContaEVincular(id, dadosUsuario);

        	return ResponseEntity.ok(
        	        new AlunoRespostaDTO(alunoAtualizado)
        	);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("erro", ex.getMessage()));
        }
    }

  
 // Ativar ou desativar aluno
 @PatchMapping("/{id}/situacao")
 @Operation(
     summary = "Alterar situação do aluno",
     description = "Ativa ou desativa um aluno."
 )
 @ApiResponses({
     @ApiResponse(responseCode = "200", description = "Situação alterada"),
     @ApiResponse(responseCode = "400", description = "Situação não informada"),
     @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
 })
 public ResponseEntity<?> alterarSituacao(
         @PathVariable Long id,
         @RequestBody Map<String, Boolean> dados) {

     Boolean ativo = dados.get("ativo");

     if (ativo == null) {
         return ResponseEntity
                 .badRequest()
                 .body(Map.of(
                         "erro",
                         "A situação do aluno deve ser informada."
                 ));
     }

     Aluno alunoAtualizado = service.alterarSituacao(id, ativo);

     return ResponseEntity.ok(
             new AlunoRespostaDTO(alunoAtualizado)
     );
 }


    // Excluir aluno
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Excluir aluno",
        description = "Exclui um aluno pelo identificador."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Aluno excluído"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
