import { useCallback, useEffect, useState } from "react";

import {
    listarAlunos,
    cadastrarAluno,
    atualizarAluno,
    alterarSituacaoAluno,
    excluirAluno
} from "../services/api";

import "../styles/Alunos.css";
const formularioInicial = {
    nome: "",
    email: "",
    matricula: "",
    dataNascimento: "",
    telefone: "",
    endereco: ""
};

function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [alunoEditando, setAlunoEditando] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [busca, setBusca] = useState("");

    const carregarAlunos = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const dados = await listarAlunos();
            setAlunos(Array.isArray(dados) ? dados : []);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarAlunos();
    }, [carregarAlunos]);

    const alunosFiltrados = alunos.filter((aluno) => {
        const termo = busca.trim().toLowerCase();

        return (
            (aluno.nome || "").toLowerCase().includes(termo) ||
            (aluno.email || "").toLowerCase().includes(termo) ||
            (aluno.matricula || "").toLowerCase().includes(termo)
        );
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario((estadoAnterior) => ({
            ...estadoAnterior,
            [name]: value
        }));
    }

    function limparFormulario() {
        setFormulario(formularioInicial);
        setAlunoEditando(null);
        setErro("");
        setMensagem("");
    }

    function iniciarEdicao(aluno) {
        setAlunoEditando(aluno.id);

        setFormulario({
            nome: aluno.nome || "",
            email: aluno.email || "",
            matricula: aluno.matricula || "",
            dataNascimento: aluno.dataNascimento || "",
            telefone: aluno.telefone || "",
            endereco: aluno.endereco || ""
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

        try {
            const dadosAluno = {
                nome: formulario.nome.trim(),
                email: formulario.email.trim(),
                matricula: formulario.matricula.trim(),
                dataNascimento: formulario.dataNascimento || null,
                telefone: formulario.telefone.trim(),
                endereco: formulario.endereco.trim()
            };

            if (alunoEditando === null) {
                await cadastrarAluno(dadosAluno);
                setMensagem("Aluno cadastrado com sucesso.");
            } else {
                await atualizarAluno(alunoEditando, dadosAluno);
                setMensagem("Aluno atualizado com sucesso.");
            }

            setFormulario(formularioInicial);
            setAlunoEditando(null);

            await carregarAlunos();
        } catch (error) {
            setErro(error.message);
        } finally {
            setSalvando(false);
        }
    }

    async function handleAlterarSituacao(aluno) {
        const novaSituacao = aluno.ativo === false;

        const confirmar = window.confirm(
            `Deseja ${novaSituacao ? "ativar" : "desativar"} o aluno ${aluno.nome}?`
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await alterarSituacaoAluno(aluno.id, novaSituacao);

            setMensagem(
                `Aluno ${novaSituacao ? "ativado" : "desativado"} com sucesso.`
            );

            await carregarAlunos();
        } catch (error) {
            setErro(error.message);
        }
    }

    async function handleExcluir(id) {
        const confirmar = window.confirm(
            "Tem certeza de que deseja excluir este aluno? Esta ação não poderá ser desfeita."
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await excluirAluno(id);

            setMensagem("Aluno excluído com sucesso.");

            if (alunoEditando === id) {
                setFormulario(formularioInicial);
                setAlunoEditando(null);
            }

            await carregarAlunos();
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <section className="pagina-usuarios">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">GESTÃO ACADÊMICA</span>
                    <h2>Alunos</h2>
                    <p>Cadastre, consulte e gerencie os alunos do EducaMais.</p>
                </div>

                <button
                    type="button"
                    className="botao-secundario"
                    onClick={carregarAlunos}
                    disabled={carregando}
                >
                    ↻ Atualizar lista
                </button>
            </div>

            <div className="filtro-usuarios">
                <label htmlFor="busca-alunos">
                    Pesquisar aluno
                </label>

                <input
                    id="busca-alunos"
                    type="search"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Digite nome, e-mail ou matrícula..."
                />
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
                        {alunoEditando === null
                            ? "Cadastrar aluno"
                            : `Editar aluno #${alunoEditando}`}
                    </h3>

                    <p>
                        {alunoEditando === null
                            ? "Preencha os dados para cadastrar um aluno."
                            : "Altere os dados desejados e salve as mudanças."}
                    </p>
                </div>

                <form className="formulario-usuario" onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="aluno-nome">Nome completo</label>
                        <input
                            id="aluno-nome"
                            name="nome"
                            type="text"
                            value={formulario.nome}
                            onChange={handleChange}
                            maxLength={150}
                            placeholder="Digite o nome completo"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="aluno-email">E-mail</label>
                        <input
                            id="aluno-email"
                            name="email"
                            type="email"
                            value={formulario.email}
                            onChange={handleChange}
                            placeholder="aluno@exemplo.com"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="aluno-matricula">Matrícula</label>
                        <input
                            id="aluno-matricula"
                            name="matricula"
                            type="text"
                            value={formulario.matricula}
                            onChange={handleChange}
                            placeholder="Ex.: EDU2026001"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="aluno-nascimento">
                            Data de nascimento
                        </label>
                        <input
                            id="aluno-nascimento"
                            name="dataNascimento"
                            type="date"
                            value={formulario.dataNascimento}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="aluno-telefone">Telefone</label>
                        <input
                            id="aluno-telefone"
                            name="telefone"
                            type="tel"
                            value={formulario.telefone}
                            onChange={handleChange}
                            placeholder="(79) 99999-9999"
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="aluno-endereco">Endereço</label>
                        <input
                            id="aluno-endereco"
                            name="endereco"
                            type="text"
                            value={formulario.endereco}
                            onChange={handleChange}
                            maxLength={255}
                            placeholder="Cidade, bairro e rua"
                        />
                    </div>

                    <div className="acoes-formulario">
                        <button
                            className="botao-principal"
                            type="submit"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : alunoEditando === null
                                    ? "Cadastrar aluno"
                                    : "Salvar alterações"}
                        </button>

                        {alunoEditando !== null && (
                            <button
                                className="botao-secundario"
                                type="button"
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
                <div className="resumo-icone">♧</div>
                <div>
                    <p>Alunos cadastrados</p>
                    <strong>
                        {carregando ? "..." : alunos.length}
                    </strong>
                </div>
            </div>

            <div className="tabela-card">
                <div className="tabela-cabecalho">
                    <h3>Lista de alunos</h3>
                    <p>Dados carregados da API EducaMais.</p>
                </div>

                {carregando ? (
                    <p className="estado-vazio">Carregando alunos...</p>
                ) : alunosFiltrados.length === 0 ? (
                    <p className="estado-vazio">
                        {alunos.length === 0
                            ? "Nenhum aluno cadastrado na API."
                            : "Nenhum aluno corresponde à pesquisa."}
                    </p>
                ) : (
                    <div className="tabela-responsiva">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Matrícula</th>
                                    <th>Situação</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {alunosFiltrados.map((aluno) => (
                                    <tr key={aluno.id}>
                                        <td>#{aluno.id}</td>
                                        <td>{aluno.nome}</td>
                                        <td>{aluno.email}</td>
                                        <td>{aluno.matricula}</td>
                                        <td>
                                            {aluno.ativo === false
                                                ? "Inativo"
                                                : "Ativo"}
                                        </td>
                                        <td>
                                            <div className="acoes-tabela">
                                                <button
                                                    type="button"
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        iniciarEdicao(aluno)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="botao-secundario"
                                                    onClick={() =>
                                                        handleAlterarSituacao(aluno)
                                                    }
                                                >
                                                    {aluno.ativo === false
                                                        ? "Ativar"
                                                        : "Desativar"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        handleExcluir(aluno.id)
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

export default Alunos;
