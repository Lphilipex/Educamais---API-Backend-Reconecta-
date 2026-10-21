import { useCallback, useEffect, useState } from "react";

import {
    listarDisciplinas,
    listarUsuarios,
    cadastrarDisciplina,
    atualizarDisciplina,
    excluirDisciplina
} from "../services/api";

import "../styles/Alunos.css";
import "../styles/Disciplinas.css";

const formularioInicial = {
    nome: "",
    descricao: "",
    usuarioId: ""
};

function Disciplinas() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [disciplinaEditando, setDisciplinaEditando] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const [erro, setErro] = useState("");
    const [erroUsuarios, setErroUsuarios] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [busca, setBusca] = useState("");

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErro("");
        setErroUsuarios("");

        const resultados = await Promise.allSettled([
            listarDisciplinas(),
            listarUsuarios()
        ]);

        const [resultadoDisciplinas, resultadoUsuarios] = resultados;

        if (
            resultadoDisciplinas.status === "fulfilled" &&
            Array.isArray(resultadoDisciplinas.value)
        ) {
            setDisciplinas(resultadoDisciplinas.value);
        } else {
            setDisciplinas([]);

            setErro(
                resultadoDisciplinas.status === "rejected"
                    ? resultadoDisciplinas.reason?.message ||
                      "Não foi possível carregar as disciplinas."
                    : "A API não retornou uma lista válida de disciplinas."
            );
        }

        if (
            resultadoUsuarios.status === "fulfilled" &&
            Array.isArray(resultadoUsuarios.value)
        ) {
            setUsuarios(resultadoUsuarios.value);
        } else {
            setUsuarios([]);

            setErroUsuarios(
                resultadoUsuarios.status === "rejected"
                    ? resultadoUsuarios.reason?.message ||
                      "Não foi possível carregar os usuários."
                    : "A API não retornou uma lista válida de usuários."
            );
        }

        setCarregando(false);
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const disciplinasFiltradas = disciplinas.filter((disciplina) => {
        const termo = busca.trim().toLowerCase();

        return (
            (disciplina.nome || "").toLowerCase().includes(termo) ||
            (disciplina.descricao || "").toLowerCase().includes(termo) ||
            (disciplina.usuario?.nome || "").toLowerCase().includes(termo)
        );
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    }

    function limparFormulario() {
        setFormulario(formularioInicial);
        setDisciplinaEditando(null);
        setErro("");
        setMensagem("");
    }

    function iniciarEdicao(disciplina) {
        setDisciplinaEditando(disciplina.id);

        setFormulario({
            nome: disciplina.nome || "",
            descricao: disciplina.descricao || "",
            usuarioId: disciplina.usuario?.id
                ? String(disciplina.usuario.id)
                : ""
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

        if (!formulario.usuarioId) {
            setErro("Selecione o usuário associado à disciplina.");
            return;
        }

        setSalvando(true);

        const dadosDisciplina = {
            nome: formulario.nome.trim(),
            descricao: formulario.descricao.trim(),
            usuario: {
                id: Number(formulario.usuarioId)
            }
        };

        try {
            if (disciplinaEditando === null) {
                await cadastrarDisciplina(dadosDisciplina);
                setMensagem("Disciplina cadastrada com sucesso.");
            } else {
                await atualizarDisciplina(
                    disciplinaEditando,
                    dadosDisciplina
                );
                setMensagem("Disciplina atualizada com sucesso.");
            }

            setFormulario(formularioInicial);
            setDisciplinaEditando(null);

            await carregarDados();
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível salvar a disciplina."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluir(disciplina) {
        const confirmar = window.confirm(
            `Deseja realmente excluir a disciplina "${disciplina.nome}"?`
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await excluirDisciplina(disciplina.id);

            setMensagem("Disciplina excluída com sucesso.");

            if (disciplinaEditando === disciplina.id) {
                setFormulario(formularioInicial);
                setDisciplinaEditando(null);
            }

            await carregarDados();
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível excluir a disciplina."
            );
        }
    }

    return (
        <section className="pagina-usuarios disciplinas-pagina">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">
                        GESTÃO ACADÊMICA
                    </span>

                    <h2>Disciplinas</h2>

                    <p>
                        Organize as disciplinas e seus responsáveis
                        no EducaMais.
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
                        {disciplinaEditando === null
                            ? "Cadastrar disciplina"
                            : `Editar disciplina #${disciplinaEditando}`}
                    </h3>

                    <p>
                        Informe o nome, a descrição e o usuário responsável.
                    </p>
                </div>

                <form
                    className="formulario-usuario"
                    onSubmit={handleSubmit}
                >
                    <div className="campo">
                        <label htmlFor="disciplina-nome">
                            Nome da disciplina
                        </label>

                        <input
                            id="disciplina-nome"
                            name="nome"
                            type="text"
                            value={formulario.nome}
                            onChange={handleChange}
                            placeholder="Ex.: Matemática"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="disciplina-descricao">
                            Descrição
                        </label>

                        <textarea
                            id="disciplina-descricao"
                            name="descricao"
                            value={formulario.descricao}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Descreva o conteúdo da disciplina"
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="disciplina-usuario">
                            Usuário responsável
                        </label>

                        <select
                            id="disciplina-usuario"
                            name="usuarioId"
                            value={formulario.usuarioId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Selecione um usuário
                            </option>

                            {usuarios.map((usuario) => (
                                <option
                                    key={usuario.id}
                                    value={usuario.id}
                                >
                                    {usuario.nome || `Usuário #${usuario.id}`}
                                    {usuario.email
                                        ? ` — ${usuario.email}`
                                        : ""}
                                </option>
                            ))}
                        </select>

                        {erroUsuarios && (
                            <p className="aviso-disciplina" role="alert">
                                {erroUsuarios}
                            </p>
                        )}
                    </div>

                    <div className="acoes-formulario">
                        <button
                            type="submit"
                            className="botao-principal"
                            disabled={
                                salvando ||
                                Boolean(erroUsuarios) ||
                                usuarios.length === 0
                            }
                        >
                            {salvando
                                ? "Salvando..."
                                : disciplinaEditando === null
                                    ? "Cadastrar disciplina"
                                    : "Salvar alterações"}
                        </button>

                        {disciplinaEditando !== null && (
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
                    <p>Disciplinas cadastradas</p>

                    <strong>
                        {carregando ? "..." : disciplinas.length}
                    </strong>
                </div>
            </div>

            <div className="filtro-usuarios">
                <label htmlFor="busca-disciplinas">
                    Pesquisar disciplina
                </label>

                <input
                    id="busca-disciplinas"
                    type="search"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Digite o nome ou a descrição..."
                />
            </div>

            <div className="tabela-card">
                <div className="tabela-cabecalho">
                    <h3>Lista de disciplinas</h3>

                    <p>
                        Disciplinas carregadas da API EducaMais.
                    </p>
                </div>

                {carregando ? (
                    <p className="estado-vazio">
                        Carregando disciplinas...
                    </p>
                ) : erro && disciplinas.length === 0 ? (
                    <p className="estado-vazio">
                        Não foi possível exibir a lista até que o erro seja resolvido.
                    </p>
                ) : disciplinasFiltradas.length === 0 ? (
                    <p className="estado-vazio">
                        {disciplinas.length === 0
                            ? "Nenhuma disciplina cadastrada."
                            : "Nenhuma disciplina corresponde à pesquisa."}
                    </p>
                ) : (
                    <div className="tabela-responsiva">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Responsável</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {disciplinasFiltradas.map((disciplina) => (
                                    <tr key={disciplina.id}>
                                        <td>#{disciplina.id}</td>
                                        <td>
                                            <strong>{disciplina.nome}</strong>
                                        </td>
                                        <td>
                                            {disciplina.descricao || "—"}
                                        </td>
                                        <td>
                                            {disciplina.usuario?.nome ||
                                                "Não informado"}
                                        </td>
                                        <td>
                                            <div className="acoes-tabela">
                                                <button
                                                    type="button"
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        iniciarEdicao(disciplina)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        handleExcluir(disciplina)
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

export default Disciplinas;