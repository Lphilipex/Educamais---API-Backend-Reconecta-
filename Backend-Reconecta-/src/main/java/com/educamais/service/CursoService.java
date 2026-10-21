
package com.educamais.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.educamais.exception.RecursoNaoEncontradoException;
import com.educamais.model.Curso;
import com.educamais.model.Disciplina;
import com.educamais.repository.CursoRepository;
import com.educamais.repository.DisciplinaRepository;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;
    private final DisciplinaRepository disciplinaRepository;

    public CursoService(
            CursoRepository cursoRepository,
            DisciplinaRepository disciplinaRepository) {
        this.cursoRepository = cursoRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    @Transactional(readOnly = true)
    public List<Curso> listar() {
        return cursoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Curso buscarPorId(Long id) {
        return cursoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Curso não encontrado"));
    }

    @Transactional
    public Curso cadastrar(Curso curso) {
        validarNome(curso.getNome());

        curso.setId(null);
        curso.setNome(curso.getNome().trim());

        associarDisciplinas(curso);

        return cursoRepository.save(curso);
    }
    @Transactional
    public Curso atualizar(Long id, Curso dados) {
        validarNome(dados.getNome());

        Curso cursoExistente = buscarPorId(id);

        cursoExistente.setNome(dados.getNome().trim());
        cursoExistente.setDescricao(dados.getDescricao());

        associarDisciplinas(cursoExistente, dados);

        return cursoRepository.save(cursoExistente);
    }

    @Transactional
    public void excluir(Long id) {
        Curso curso = buscarPorId(id);
        cursoRepository.delete(curso);
    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException(
                    "O nome do curso é obrigatório");
        }
    }

    private void associarDisciplinas(Curso curso) {
        associarDisciplinas(curso, curso);
    }

    private void associarDisciplinas(Curso destino, Curso dados) {
        if (dados.getDisciplinas() == null
                || dados.getDisciplinas().isEmpty()) {
            destino.setDisciplinas(new HashSet<>());
            return;
        }

        var ids = dados.getDisciplinas().stream()
                .map(Disciplina::getId)
                .toList();

        if (ids.stream().anyMatch(id -> id == null)) {
            throw new IllegalArgumentException(
                    "Todas as disciplinas devem possuir um ID válido");
        }

        var disciplinas = disciplinaRepository.findAllById(ids);

        if (disciplinas.size() != ids.stream().distinct().count()) {
            throw new RecursoNaoEncontradoException(
                    "Uma ou mais disciplinas não foram encontradas");
        }

        destino.setDisciplinas(new HashSet<>(disciplinas));
    }
}
