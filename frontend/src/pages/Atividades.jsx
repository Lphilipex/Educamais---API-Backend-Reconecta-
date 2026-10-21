import { useCallback, useEffect, useState } from "react";

import {
    listarAtividades,
    listarDisciplinas,
    cadastrarAtividade,
    atualizarAtividade,
    excluirAtividade
} from "../services/api";

import "../styles/Alunos.css";
import "../styles/Atividades.css";

const formularioInicial = {
    titulo: "",
    descricao: "",
    dataEntrega: "",
    disciplinaId: ""
};

function Atividades() {
    const [atividades, setAtividades] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);

    const [formulario, setFormulario] = useState(formularioInicial);
    const [atividadeEditando, setAtividadeEditando] = useState(null);

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

        const resultados = await Promise.allSettled([
            listarAtividades(),
            listarDisciplinas()
        ]);

        const [resultadoAtividades, resultadoDisciplinas] = resultados;

        if (
            resultadoAtividades.status === "fulfilled" &&
            Array.isArray(resultadoAtividades.value)
        ) {
            setAtividades(resultadoAtividades.value);
        } else {
            setAtividades([]);

            setErro(
                resultadoAtividades.status === "rejected"
                    ? resultadoAtividades.reason?.message ||
                      "Não foi possível carregar as atividades."
                    : "A API não retornou uma lista válida de atividades."
            );
        }

        if (
            resultadoDisciplinas.status === "fulfilled" &&
            Array.isArray(resultadoDisciplinas.value)
        ) {
            setDisciplinas(resultadoDisciplinas.value);
        } else {
            setDisciplinas([]);

            setErroDisciplinas(
                resultadoDisciplinas.status === "rejected"
                    ? resultadoDisciplinas.reason?.message ||
                      "Não foi possível carregar as disciplinas."
                    : "A API não retornou uma lista válida de disciplinas."
            );
        }

        setCarregando(false);
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const atividadesFiltradas = atividades.filter((atividade) => {
        const termo = busca.trim().toLowerCase();

        return (
            (atividade.titulo || "").toLowerCase().includes(termo) ||
            (atividade.descricao || "").toLowerCase().includes(termo) ||
            (atividade.disciplina?.nome || "")
                .toLowerCase()
                .includes(termo)
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
        setAtividadeEditando(null);
        setErro("");
        setMensagem("");
    }

    function iniciarEdicao(atividade) {
        setAtividadeEditando(atividade.id);

        setFormulario({
            titulo: atividade.titulo || "",
            descricao: atividade.descricao || "",
            dataEntrega: atividade.dataEntrega
                ? String(atividade.dataEntrega).slice(0, 10)
                : "",
            disciplinaId: atividade.disciplina?.id
                ? String(atividade.disciplina.id)
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

        if (!formulario.disciplinaId) {
            setErro("Selecione uma disciplina para a atividade.");
            return;
        }

        setSalvando(true);

        const dadosAtividade = {
            titulo: formulario.titulo.trim(),
            descricao: formulario.descricao.trim(),
            dataEntrega: formulario.dataEntrega || null,
            disciplina: {
                id: Number(formulario.disciplinaId)
            }
        };

        try {
            if (atividadeEditando === null) {
                await cadastrarAtividade(dadosAtividade);
                setMensagem("Atividade cadastrada com sucesso.");
            } else {
                await atualizarAtividade(
                    atividadeEditando,
                    dadosAtividade
                );
                setMensagem("Atividade atualizada com sucesso.");
            }

            setFormulario(formularioInicial);
            setAtividadeEditando(null);

            await carregarDados();
        } catch (error) {
            setErro(error.message || "Não foi possível salvar a atividade.");
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluir(atividade) {
        const confirmar = window.confirm(
            `Deseja realmente excluir a atividade "${atividade.titulo}"?`
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await excluirAtividade(atividade.id);

            setMensagem("Atividade excluída com sucesso.");

            if (atividadeEditando === atividade.id) {
                setFormulario(formularioInicial);
                setAtividadeEditando(null);
            }

            await carregarDados();
        } catch (error) {
            setErro(error.message || "Não foi possível excluir a atividade.");
        }
    }

    function formatarData(data) {
        if (!data) {
            return "Não informada";
        }

        const partes = String(data).slice(0, 10).split("-");

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        return String(data);
    }

    return (
        <section className="pagina-usuarios atividades-pagina">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">GESTÃO ACADÊMICA</span>
                    <h2>Atividades</h2>
                    <p>
                        Cadastre, consulte e organize as atividades
                        educacionais.
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
                        {atividadeEditando === null
                            ? "Cadastrar atividade"
                            : `Editar atividade #${atividadeEditando}`}
                    </h3>

                    <p>
                        Preencha o título e associe a atividade a uma disciplina.
                    </p>
                </div>

                <form
                    className="formulario-usuario"
                    onSubmit={handleSubmit}
                >
                    <div className="campo">
                        <label htmlFor="atividade-titulo">
                            Título da atividade
                        </label>

                        <input
                            id="atividade-titulo"
                            name="titulo"
                            type="text"
                            value={formulario.titulo}
                            onChange={handleChange}
                            maxLength={200}
                            placeholder="Ex.: Exercícios de Matemática"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="atividade-descricao">
                            Descrição
                        </label>

                        <textarea
                            id="atividade-descricao"
                            name="descricao"
                            value={formulario.descricao}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Descreva as orientações da atividade"
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="atividade-data">
                            Data de entrega
                        </label>

                        <input
                            id="atividade-data"
                            name="dataEntrega"
                            type="date"
                            value={formulario.dataEntrega}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="atividade-disciplina">
                            Disciplina
                        </label>

                        <select
                            id="atividade-disciplina"
                            name="disciplinaId"
                            value={formulario.disciplinaId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Selecione uma disciplina
                            </option>

                            {disciplinas.map((disciplina) => (
                                <option
                                    key={disciplina.id}
                                    value={disciplina.id}
                                >
                                    {disciplina.nome ||
                                        `Disciplina #${disciplina.id}`}
                                </option>
                            ))}
                        </select>

                        {erroDisciplinas && (
                            <p
                                className="aviso-atividade"
                                role="alert"
                            >
                                {erroDisciplinas}
                            </p>
                        )}

                        {!erroDisciplinas &&
                            disciplinas.length === 0 &&
                            !carregando && (
                                <p className="aviso-atividade">
                                    Não há disciplinas disponíveis.
                                </p>
                            )}
                    </div>

                    <div className="acoes-formulario">
                        <button
                            type="submit"
                            className="botao-principal"
                            disabled={
                                salvando ||
                                Boolean(erroDisciplinas) ||
                                disciplinas.length === 0
                            }
                        >
                            {salvando
                                ? "Salvando..."
                                : atividadeEditando === null
                                    ? "Cadastrar atividade"
                                    : "Salvar alterações"}
                        </button>

                        {atividadeEditando !== null && (
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
                <div className="resumo-icone">✎</div>

                <div>
                    <p>Atividades cadastradas</p>
                    <strong>
                        {carregando ? "..." : atividades.length}
                    </strong>
                </div>
            </div>

            <div className="filtro-usuarios">
                <label htmlFor="busca-atividades">
                    Pesquisar atividade
                </label>

                <input
                    id="busca-atividades"
                    type="search"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Digite o título, descrição ou disciplina..."
                />
            </div>

            <div className="tabela-card">
                <div className="tabela-cabecalho">
                    <h3>Lista de atividades</h3>
                    <p>Atividades carregadas da API EducaMais.</p>
                </div>

                {carregando ? (
                    <p className="estado-vazio">
                        Carregando atividades...
                    </p>
                ) : erro && atividades.length === 0 ? (
                    <p className="estado-vazio">
                        Não foi possível exibir a lista até que o erro seja resolvido.
                    </p>
                ) : atividadesFiltradas.length === 0 ? (
                    <p className="estado-vazio">
                        {atividades.length === 0
                            ? "Nenhuma atividade cadastrada."
                            : "Nenhuma atividade corresponde à pesquisa."}
                    </p>
                ) : (
                    <div className="tabela-responsiva">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Disciplina</th>
                                    <th>Entrega</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {atividadesFiltradas.map((atividade) => (
                                    <tr key={atividade.id}>
                                        <td>#{atividade.id}</td>
                                        <td>
                                            <strong>{atividade.titulo}</strong>
                                            {atividade.descricao && (
                                                <p className="descricao-atividade">
                                                    {atividade.descricao}
                                                </p>
                                            )}
                                        </td>
                                        <td>
                                            {atividade.disciplina?.nome ||
                                                "Não informada"}
                                        </td>
                                        <td>
                                            {formatarData(
                                                atividade.dataEntrega
                                            )}
                                        </td>
                                        <td>
                                            <div className="acoes-tabela">
                                                <button
                                                    type="button"
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        iniciarEdicao(atividade)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        handleExcluir(atividade)
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

export default Atividades;