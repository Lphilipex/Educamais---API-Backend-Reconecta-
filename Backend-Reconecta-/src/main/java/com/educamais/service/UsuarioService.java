
package com.educamais.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.educamais.dto.UsuarioAtualizacaoDTO;
import com.educamais.exception.ConflitoDeDadosException;
import com.educamais.exception.RecursoNaoEncontradoException;
import com.educamais.model.PerfilUsuario;
import com.educamais.model.Usuario;
import com.educamais.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // Listar somente usuários ativos
    public List<Usuario> listar() {
        return repository.findAllByAtivoTrue();
    }

    // Buscar somente usuários ativos pelo ID
    public Usuario buscarPorId(Long id) {
        return repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Usuário não encontrado"
                ));
    }

    // Verificar se o e-mail já está cadastrado
    public boolean existeEmail(String email) {
        return repository.existsByEmail(email);
    }

    // Cadastrar usuário com senha criptografada
    @Transactional
    public Usuario cadastrar(Usuario usuario) {

        if (repository.existsByEmail(usuario.getEmail())) {
            throw new ConflitoDeDadosException(
                    "Já existe um usuário cadastrado com este e-mail."
            );
        }

        usuario.setId(null);
        usuario.setSenha(
                passwordEncoder.encode(usuario.getSenha())
        );
        usuario.setAtivo(true);
        usuario.setPerfil(PerfilUsuario.ALUNO);

        return repository.save(usuario);
    }

    // Atualizar os dados de um usuário ativo
    @Transactional
    public Usuario atualizar(
            Long id,
            UsuarioAtualizacaoDTO dados) {

        Usuario usuarioExistente = buscarPorId(id);

        // Verificar se o e-mail pertence a outro usuário
        repository.findByEmail(dados.getEmail())
                .filter(usuario -> !usuario.getId().equals(id))
                .ifPresent(usuario -> {
                    throw new ConflitoDeDadosException(
                            "Já existe outro usuário cadastrado com este e-mail."
                    );
                });

        usuarioExistente.setNome(dados.getNome());
        usuarioExistente.setEmail(dados.getEmail());

        // Atualizar a senha somente se uma nova for informada
        if (dados.getSenha() != null
                && !dados.getSenha().isBlank()) {

            usuarioExistente.setSenha(
                    passwordEncoder.encode(dados.getSenha())
            );
        }

        // Preservar o perfil e o status atual
        return repository.save(usuarioExistente);
    }

    // Desativar usuário sem excluir o registro do banco
    @Transactional
    public void excluir(Long id) {

        Usuario usuario = buscarPorId(id);

        usuario.setAtivo(false);

        repository.save(usuario);
    }
}
