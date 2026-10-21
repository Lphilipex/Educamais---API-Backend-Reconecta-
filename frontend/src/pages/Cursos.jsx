import { useCallback, useEffect, useState } from "react";

import {
    listarCursos,
    listarDisciplinas,
    cadastrarCurso,
    atualizarCurso,
    excluirCurso
} from "../services/api";

import "../styles/Alunos.css";
import "../styles/Cursos.css";

const formularioInicial = {
    nome: "",
    descricao: "",
    disciplinaIds: []
};

function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);

    const [formulario, setFormulario] = useState(formularioInicial);
    const [cursoEditando, setCursoEditando] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const [erro, setErro] = useState("");
    const [erroDisciplinas, setErroDisciplinas] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [busca, setBusca] = useState("");

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErro("");
        setErroDisciplinas("");

        try {
            const dados = await listarCursos();
            setCursos(Array.isArray(dados) ? dados : []);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }

        try {
            const dados = await listarDisciplinas();
            setDisciplinas(Array.isArray(dados) ? dados : []);
        } catch (error) {
            setErroDisciplinas(error.message);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const cursosFiltrados = cursos.filter((curso) => {
        const termo = busca.trim().toLowerCase();

        return (
            (curso.nome || "").toLowerCase().includes(termo) ||
            (curso.descricao || "").toLowerCase().includes(termo)
        );
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    }

    function alternarDisciplina(id) {
        const disciplinaId = Number(id);

        setFormulario((anterior) => ({
            ...anterior,
            disciplinaIds: anterior.disciplinaIds.includes(disciplinaId)
                ? anterior.disciplinaIds.filter(
                    (item) => item !== disciplinaId
                )
                : [...anterior.disciplinaIds, disciplinaId]
        }));
    }

    function limparFormulario() {
        setFormulario(formularioInicial);
        setCursoEditando(null);
        setErro("");
        setMensagem("");
    }

    function iniciarEdicao(curso) {
        setCursoEditando(curso.id);

        setFormulario({
            nome: curso.nome || "",
            descricao: curso.descricao || "",
            disciplinaIds: Array.isArray(curso.disciplinas)
                ? curso.disciplinas.map((disciplina) =>
                    Number(disciplina.id)
                )
                : []
        });

        setErro("");
        setMensagem("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setErro("");
        setMensagem("");
        setSalvando(true);

        const dadosCurso = {
            nome: formulario.nome.trim(),
            descricao: formulario.descricao.trim(),
            disciplinas: formulario.disciplinaIds.map((id) => ({
                id
            }))
        };

        try {
            if (cursoEditando === null) {
                await cadastrarCurso(dadosCurso);
                setMensagem("Curso cadastrado com sucesso.");
            } else {
                await atualizarCurso(cursoEditando, dadosCurso);
                setMensagem("Curso atualizado com sucesso.");
            }

            setFormulario(formularioInicial);
            setCursoEditando(null);

            await carregarDados();
        } catch (error) {
            setErro(error.message);
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluir(curso) {
        const confirmar = window.confirm(
            `Deseja realmente excluir o curso "${curso.nome}"?`
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await excluirCurso(curso.id);

            setMensagem("Curso excluído com sucesso.");

            if (cursoEditando === curso.id) {
                setFormulario(formularioInicial);
                setCursoEditando(null);
            }

            await carregarDados();
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <section className="pagina-usuarios cursos-pagina">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">GESTÃO ACADÊMICA</span>
                    <h2>Cursos</h2>
                    <p>
                        Cadastre, consulte e organize os cursos do EducaMais.
                    </p>
                </div>

                <button
                    type="button"
                    className="botao-secundario"
                    onClick={carregarDados}
                    disabled={carregando}
                >
                    ↻ Atualizar lista
                </button>
            </div>

            {mensagem && (
                <div className="mensagem-sucesso" role="status">
                    {mensagem}
                </div>
            )}

            {erro && (
                <div className="mensagem-erro" role="alert">
                    <strong>Não foi possível concluir a operação.</strong>
                    <p>{erro}</p>
                </div>
            )}

            <div className="formulario-card">
                <div className="tabela-cabecalho">
                    <h3>
                        {cursoEditando === null
                            ? "Cadastrar curso"
                            : `Editar curso #${cursoEditando}`}
                    </h3>

                    <p>
                        Informe o nome, a descrição e as disciplinas
                        relacionadas ao curso.
                    </p>
                </div>

                <form
                    className="formulario-usuario"
                    onSubmit={handleSubmit}
                >
                    <div className="campo">
                        <label htmlFor="curso-nome">Nome do curso</label>
                        <input
                            id="curso-nome"
                            name="nome"
                            type="text"
                            value={formulario.nome}
                            onChange={handleChange}
                            maxLength={200}
                            placeholder="Ex.: Matemática básica"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="curso-descricao">Descrição</label>
                        <textarea
                            id="curso-descricao"
                            name="descricao"
                            value={formulario.descricao}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Descreva o conteúdo do curso"
                        />
                    </div>

                    <div className="campo campo-disciplinas">
                        <span className="rotulo-disciplinas">
                            Disciplinas relacionadas
                        </span>

                        {erroDisciplinas && (
                            <p className="aviso-disciplinas" role="alert">
                                {erroDisciplinas}
                            </p>
                        )}

                        {!erroDisciplinas && disciplinas.length === 0 ? (
                            <p className="estado-vazio">
                                Nenhuma disciplina disponível para seleção.
                            </p>
                        ) : (
                            <div className="lista-disciplinas">
                                {disciplinas.map((disciplina) => (
                                    <label
                                        className="disciplina-opcao"
                                        key={disciplina.id}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formulario.disciplinaIds.includes(
                                                Number(disciplina.id)
                                            )}
                                            onChange={() =>
                                                alternarDisciplina(disciplina.id)
                                            }
                                        />

                                        <span>
                                            {disciplina.nome ||
                                                `Disciplina #${disciplina.id}`}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="acoes-formulario">
                        <button
                            type="submit"
                            className="botao-principal"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : cursoEditando === null
                                    ? "Cadastrar curso"
                                    : "Salvar alterações"}
                        </button>

                        {cursoEditando !== null && (
                            <button
                                type="button"
                                className="botao-secundario"
                                onClick={limparFormulario}
                                disabled={salvando}
                            >
                                Cancelar edição
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="resumo-card">
                <div className="resumo-icone">▤</div>
                <div>
                    <p>Cursos cadastrados</p>
                    <strong>{carregando ? "..." : cursos.length}</strong>
                </div>
            </div>

            <div className="filtro-usuarios">
                <label htmlFor="busca-cursos">Pesquisar curso</label>
                <input
                    id="busca-cursos"
                    type="search"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Digite o nome ou a descrição..."
                />
            </div>

            <div className="tabela-card">
                <div className="tabela-cabecalho">
                    <h3>Lista de cursos</h3>
                    <p>Cursos carregados da API EducaMais.</p>
                </div>

                {carregando ? (
                    <p className="estado-vazio">Carregando cursos...</p>
                ) : cursosFiltrados.length === 0 ? (
                    <p className="estado-vazio">
                        {cursos.length === 0
                            ? "Nenhum curso encontrado na API."
                            : "Nenhum curso corresponde à pesquisa."}
                    </p>
                ) : (
                    <div className="tabela-responsiva">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Disciplinas</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cursosFiltrados.map((curso) => (
                                    <tr key={curso.id}>
                                        <td>#{curso.id}</td>
                                        <td>{curso.nome}</td>
                                        <td>{curso.descricao || "—"}</td>
                                        <td>
                                            {Array.isArray(curso.disciplinas) &&
                                            curso.disciplinas.length > 0
                                                ? curso.disciplinas
                                                    .map((disciplina) =>
                                                        disciplina.nome
                                                    )
                                                    .filter(Boolean)
                                                    .join(", ")
                                                : "—"}
                                        </td>
                                        <td>
                                            <div className="acoes-tabela">
                                                <button
                                                    type="button"
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        iniciarEdicao(curso)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        handleExcluir(curso)
                                                    }
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Cursos;