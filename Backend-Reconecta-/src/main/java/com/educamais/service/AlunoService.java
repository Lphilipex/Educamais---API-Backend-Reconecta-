
package com.educamais.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.educamais.dto.AlunoCadastroDTO;
import com.educamais.exception.ConflitoDeDadosException;
import com.educamais.exception.RecursoNaoEncontradoException;
import com.educamais.model.Aluno;
import com.educamais.model.PerfilUsuario;
import com.educamais.model.Usuario;
import com.educamais.repository.AlunoRepository;
import com.educamais.repository.UsuarioRepository;

@Service
public class AlunoService {

    private final AlunoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(
            AlunoRepository repository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Listar todos os alunos
    public List<Aluno> listar() {
        return repository.findAll();
    }

    // Buscar aluno por ID
    public Aluno buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno não encontrado"
                ));
    }

    // Buscar aluno vinculado ao usuário autenticado pelo e-mail
    public Optional<Aluno> buscarPorEmailDoUsuario(String email) {
        return repository.findByUsuario_Email(email);
    }

    // Verificar se o e-mail já está cadastrado entre os alunos
    public boolean existeEmail(String email) {
        return repository.existsByEmail(email);
    }

    // Verificar se a matrícula já está cadastrada
    public boolean existeMatricula(String matricula) {
        return repository.existsByMatricula(matricula);
    }

    // Criar uma conta de usuário e vinculá-la a um aluno existente
    @Transactional
    public Aluno criarContaEVincular(Long alunoId, Usuario dadosUsuario) {

        Aluno aluno = buscarPorId(alunoId);

        validarDadosUsuario(dadosUsuario);

        if (aluno.getUsuario() != null) {
            throw new ConflitoDeDadosException(
                    "Este aluno já possui uma conta de usuário vinculada."
            );
        }

        if (usuarioRepository.existsByEmail(dadosUsuario.getEmail())) {
            throw new ConflitoDeDadosException(
                    "Já existe um usuário cadastrado com este e-mail."
            );
        }

        Usuario novoUsuario = criarUsuario(dadosUsuario);
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        aluno.setUsuario(usuarioSalvo);

        return repository.save(aluno);
    }

    // Cadastrar aluno usando os dados recebidos pelo DTO
    @Transactional
    public Aluno cadastrar(AlunoCadastroDTO dados) {

        if (dados == null) {
            throw new IllegalArgumentException(
                    "Os dados do aluno devem ser informados."
            );
        }

        if (repository.existsByEmail(dados.getEmail())) {
            throw new ConflitoDeDadosException(
                    "Já existe um aluno cadastrado com este e-mail."
            );
        }

        if (repository.existsByMatricula(dados.getMatricula())) {
            throw new ConflitoDeDadosException(
                    "Já existe um aluno cadastrado com esta matrícula."
            );
        }

        if (dados.getConta() == null) {
            throw new IllegalArgumentException(
                    "Os dados da conta de usuário não foram enviados."
            );
        }

        // Preparar os dados da conta a partir do DTO
        Usuario dadosUsuario = new Usuario();
        dadosUsuario.setNome(dados.getNome());
        dadosUsuario.setEmail(dados.getEmail());
        dadosUsuario.setSenha(dados.getConta().getSenha());

        validarDadosUsuario(dadosUsuario);

        if (usuarioRepository.existsByEmail(dadosUsuario.getEmail())) {
            throw new ConflitoDeDadosException(
                    "Já existe um usuário cadastrado com este e-mail."
            );
        }

        // Criar a conta com senha codificada
        Usuario novoUsuario = criarUsuario(dadosUsuario);
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        // Preparar os dados do aluno
        Aluno novoAluno = new Aluno();
        novoAluno.setNome(dados.getNome());
        novoAluno.setEmail(dados.getEmail());
        novoAluno.setMatricula(dados.getMatricula());
        novoAluno.setDataNascimento(dados.getDataNascimento());
        novoAluno.setTelefone(dados.getTelefone());
        novoAluno.setEndereco(dados.getEndereco());
        novoAluno.setUsuario(usuarioSalvo);
        novoAluno.setAtivo(true);

        return repository.save(novoAluno);
    }

    // Manter compatibilidade com cadastros que já utilizam a entidade Aluno
    @Transactional
    public Aluno cadastrar(Aluno aluno) {

        if (aluno == null) {
            throw new IllegalArgumentException(
                    "Os dados do aluno devem ser informados."
            );
        }

        if (repository.existsByEmail(aluno.getEmail())) {
            throw new ConflitoDeDadosException(
                    "Já existe um aluno cadastrado com este e-mail."
            );
        }

        if (repository.existsByMatricula(aluno.getMatricula())) {
            throw new ConflitoDeDadosException(
                    "Já existe um aluno cadastrado com esta matrícula."
            );
        }

        Usuario dadosUsuario = aluno.getUsuario();

        validarDadosUsuario(dadosUsuario);

        if (usuarioRepository.existsByEmail(dadosUsuario.getEmail())) {
            throw new ConflitoDeDadosException(
                    "Já existe um usuário cadastrado com este e-mail."
            );
        }

        Usuario novoUsuario = criarUsuario(dadosUsuario);
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        aluno.setId(null);
        aluno.setUsuario(usuarioSalvo);
        aluno.setAtivo(true);

        return repository.save(aluno);
    }

    // Validar os dados necessários para criar uma conta
    private void validarDadosUsuario(Usuario dadosUsuario) {

        if (dadosUsuario == null) {
            throw new IllegalArgumentException(
                    "Os dados da conta de usuário não foram enviados."
            );
        }

        if (dadosUsuario.getNome() == null
                || dadosUsuario.getNome().isBlank()) {
            throw new IllegalArgumentException(
                    "O nome da conta de usuário não foi informado."
            );
        }

        if (dadosUsuario.getEmail() == null
                || dadosUsuario.getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "O e-mail da conta de usuário não foi informado."
            );
        }

        if (dadosUsuario.getSenha() == null
                || dadosUsuario.getSenha().length() < 6) {
            throw new IllegalArgumentException(
                    "A senha da conta não foi recebida ou tem menos de 6 caracteres."
            );
        }
    }

    // Criar usuário com senha codificada e perfil ALUNO
    private Usuario criarUsuario(Usuario dadosUsuario) {

        Usuario novoUsuario = new Usuario();

        novoUsuario.setNome(dadosUsuario.getNome());
        novoUsuario.setEmail(dadosUsuario.getEmail());
        novoUsuario.setSenha(
                passwordEncoder.encode(dadosUsuario.getSenha())
        );
        novoUsuario.setPerfil(PerfilUsuario.ALUNO);
        novoUsuario.setAtivo(true);

        return novoUsuario;
    }

    // Atualizar aluno
    public Aluno atualizar(Long id, Aluno dados) {

        Aluno alunoExistente = buscarPorId(id);

        repository.findByEmail(dados.getEmail())
                .filter(aluno -> !aluno.getId().equals(id))
                .ifPresent(aluno -> {
                    throw new ConflitoDeDadosException(
                            "Já existe outro aluno cadastrado com este e-mail."
                    );
                });

        repository.findByMatricula(dados.getMatricula())
                .filter(aluno -> !aluno.getId().equals(id))
                .ifPresent(aluno -> {
                    throw new ConflitoDeDadosException(
                            "Já existe outro aluno cadastrado com esta matrícula."
                    );
                });

        alunoExistente.setNome(dados.getNome());
        alunoExistente.setEmail(dados.getEmail());
        alunoExistente.setMatricula(dados.getMatricula());
        alunoExistente.setDataNascimento(dados.getDataNascimento());
        alunoExistente.setTelefone(dados.getTelefone());
        alunoExistente.setEndereco(dados.getEndereco());

        return repository.save(alunoExistente);
    }


    // Ativar ou desativar aluno e sua conta vinculada
    @Transactional
    public Aluno alterarSituacao(Long id, Boolean ativo) {

        if (ativo == null) {
            throw new IllegalArgumentException(
                    "A situação do aluno deve ser informada."
            );
        }

        Aluno aluno = buscarPorId(id);

        // Atualiza a situação do aluno
        aluno.setAtivo(ativo);

        // Atualiza também a conta vinculada, se existir
        Usuario usuario = aluno.getUsuario();

        if (usuario != null) {
            usuario.setAtivo(ativo);
            usuarioRepository.save(usuario);
        }

        return repository.save(aluno);
    }

    // Excluir aluno
    public void excluir(Long id) {

        Aluno aluno = buscarPorId(id);

        repository.delete(aluno);
    }
}
