import { useCallback, useEffect, useState } from "react";

import {
    listarMateriais,
    listarDisciplinas,
    cadastrarMaterial,
    atualizarMaterial,
    excluirMaterial
} from "../services/api";

import "../styles/Alunos.css";
import "../styles/Materiais.css";

const formularioInicial = {
    titulo: "",
    descricao: "",
    url: "",
    disciplinaId: ""
};

function Materiais({ somenteConsulta = false }) {
    const [materiais, setMateriais] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [materialEditando, setMaterialEditando] = useState(null);

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
            listarMateriais(),
            somenteConsulta
                ? Promise.resolve([])
                : listarDisciplinas()
        ]);

        const [resultadoMateriais, resultadoDisciplinas] = resultados;

        if (
            resultadoMateriais.status === "fulfilled" &&
            Array.isArray(resultadoMateriais.value)
        ) {
            setMateriais(resultadoMateriais.value);
        } else {
            setMateriais([]);
            setErro(
                resultadoMateriais.status === "rejected"
                    ? resultadoMateriais.reason?.message ||
                      "Não foi possível carregar os materiais."
                    : "A API não retornou uma lista válida de materiais."
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
    }, [somenteConsulta]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const materiaisFiltrados = materiais.filter((material) => {
        const termo = busca.trim().toLowerCase();

        return (
            (material.titulo || "").toLowerCase().includes(termo) ||
            (material.descricao || "").toLowerCase().includes(termo) ||
            (material.disciplina?.nome || "").toLowerCase().includes(termo)
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
        setMaterialEditando(null);
        setErro("");
        setMensagem("");
    }

    function iniciarEdicao(material) {
        setMaterialEditando(material.id);

        setFormulario({
            titulo: material.titulo || "",
            descricao: material.descricao || "",
            url: material.url || "",
            disciplinaId: material.disciplina?.id
                ? String(material.disciplina.id)
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

        if (somenteConsulta) {
            return;
        }

        setErro("");
        setMensagem("");

        if (!formulario.disciplinaId) {
            setErro("Selecione uma disciplina para o material.");
            return;
        }

        setSalvando(true);

        const dadosMaterial = {
            titulo: formulario.titulo.trim(),
            descricao: formulario.descricao.trim(),
            url: formulario.url.trim() || null,
            disciplina: {
                id: Number(formulario.disciplinaId)
            }
        };

        try {
            if (materialEditando === null) {
                await cadastrarMaterial(dadosMaterial);
                setMensagem("Material cadastrado com sucesso.");
            } else {
                await atualizarMaterial(materialEditando, dadosMaterial);
                setMensagem("Material atualizado com sucesso.");
            }

            setFormulario(formularioInicial);
            setMaterialEditando(null);

            await carregarDados();
        } catch (error) {
            setErro(
                error.message || "Não foi possível salvar o material."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluir(material) {
        if (somenteConsulta) {
            return;
        }

        const confirmar = window.confirm(
            `Deseja realmente excluir o material "${material.titulo}"?`
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await excluirMaterial(material.id);
            setMensagem("Material excluído com sucesso.");

            if (materialEditando === material.id) {
                setFormulario(formularioInicial);
                setMaterialEditando(null);
            }

            await carregarDados();
        } catch (error) {
            setErro(
                error.message || "Não foi possível excluir o material."
            );
        }
    }

    return (
        <section className="pagina-usuarios materiais-pagina">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">GESTÃO ACADÊMICA</span>
                    <h2>Materiais</h2>
                    <p>
                        {somenteConsulta
                            ? "Consulte os materiais de estudo disponíveis."
                            : "Cadastre e organize os materiais de estudo."}
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

            {!somenteConsulta && (
                <div className="formulario-card">
                    <div className="tabela-cabecalho">
                        <h3>
                            {materialEditando === null
                                ? "Cadastrar material"
                                : `Editar material #${materialEditando}`}
                        </h3>
                        <p>
                            Preencha os dados e selecione a disciplina relacionada.
                        </p>
                    </div>

                    <form
                        className="formulario-usuario"
                        onSubmit={handleSubmit}
                    >
                        <div className="campo">
                            <label htmlFor="material-titulo">
                                Título do material
                            </label>
                            <input
                                id="material-titulo"
                                name="titulo"
                                type="text"
                                value={formulario.titulo}
                                onChange={handleChange}
                                placeholder="Ex.: Apostila de Matemática"
                                required
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="material-descricao">
                                Descrição
                            </label>
                            <textarea
                                id="material-descricao"
                                name="descricao"
                                value={formulario.descricao}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Descreva o conteúdo do material"
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="material-url">
                                URL do material
                            </label>
                            <input
                                id="material-url"
                                name="url"
                                type="url"
                                value={formulario.url}
                                onChange={handleChange}
                                placeholder="https://exemplo.com/material"
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="material-disciplina">
                                Disciplina
                            </label>
                            <select
                                id="material-disciplina"
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
                                <p className="aviso-material" role="alert">
                                    {erroDisciplinas}
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
                                    : materialEditando === null
                                        ? "Cadastrar material"
                                        : "Salvar alterações"}
                            </button>

                            {materialEditando !== null && (
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
            )}

            <div className="resumo-card">
                <div className="resumo-icone">▧</div>
                <div>
                    <p>Materiais disponíveis</p>
                    <strong>{carregando ? "..." : materiais.length}</strong>
                </div>
            </div>

            <div className="filtro-usuarios">
                <label htmlFor="busca-materiais">
                    Pesquisar material
                </label>
                <input
                    id="busca-materiais"
                    type="search"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Digite o título, descrição ou disciplina..."
                />
            </div>

            <div className="tabela-card">
                <div className="tabela-cabecalho">
                    <h3>Lista de materiais</h3>
                    <p>Materiais carregados da API EducaMais.</p>
                </div>

                {carregando ? (
                    <p className="estado-vazio">
                        Carregando materiais...
                    </p>
                ) : erro && materiais.length === 0 ? (
                    <p className="estado-vazio">
                        Não foi possível exibir a lista até que o erro seja resolvido.
                    </p>
                ) : materiaisFiltrados.length === 0 ? (
                    <p className="estado-vazio">
                        {materiais.length === 0
                            ? "Nenhum material cadastrado."
                            : "Nenhum material corresponde à pesquisa."}
                    </p>
                ) : (
                    <div className="tabela-responsiva">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Disciplina</th>
                                    <th>Link</th>
                                    {!somenteConsulta && <th>Ações</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {materiaisFiltrados.map((material) => (
                                    <tr key={material.id}>
                                        <td>#{material.id}</td>
                                        <td>
                                            <strong>{material.titulo}</strong>
                                            {material.descricao && (
                                                <p className="descricao-material">
                                                    {material.descricao}
                                                </p>
                                            )}
                                        </td>
                                        <td>
                                            {material.disciplina?.nome ||
                                                "Não informada"}
                                        </td>
                                        <td>
                                            {material.url ? (
                                                <a
                                                    className="link-material"
                                                    href={material.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Abrir material ↗
                                                </a>
                                            ) : (
                                                "Sem link"
                                            )}
                                        </td>

                                        {!somenteConsulta && (
                                            <td>
                                                <div className="acoes-tabela">
                                                    <button
                                                        type="button"
                                                        className="botao-editar"
                                                        onClick={() =>
                                                            iniciarEdicao(material)
                                                        }
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="botao-excluir"
                                                        onClick={() =>
                                                            handleExcluir(material)
                                                        }
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        )}
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

export default Materiais;