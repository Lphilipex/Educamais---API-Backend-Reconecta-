
import { useCallback, useEffect, useState } from "react";
import {
    listarUsuarios,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
} from "../services/api";
import "../styles/Usuarios.css";


const formularioInicial = {
    nome: "",
    email: "",
    senha: ""
};

function Usuarios() {
    
    const [usuarios, setUsuarios] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [busca, setBusca] = useState("");

    const carregarUsuarios = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const dados = await listarUsuarios();
            setUsuarios(Array.isArray(dados) ? dados : []);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarUsuarios();
    }, [carregarUsuarios]);
    
    const usuariosFiltrados = usuarios.filter((usuario) => {
    const termo = busca.trim().toLowerCase();

        return (
            (usuario.nome || "").toLowerCase().includes(termo) ||
            (usuario.email || "").toLowerCase().includes(termo)
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
        setUsuarioEditando(null);
        setErro("");
        setMensagem("");
    }

    function iniciarEdicao(usuario) {
        setUsuarioEditando(usuario.id);

        setFormulario({
            nome: usuario.nome || "",
            email: usuario.email || "",
            senha: ""
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
            const dadosUsuario = {
                nome: formulario.nome.trim(),
                email: formulario.email.trim()
            };

            if (usuarioEditando === null) {
                dadosUsuario.senha = formulario.senha;

                await cadastrarUsuario(dadosUsuario);
                setMensagem("Usuário cadastrado com sucesso.");
            } else {
                if (formulario.senha.trim() !== "") {
                    dadosUsuario.senha = formulario.senha;
                }

                await atualizarUsuario(usuarioEditando, dadosUsuario);
                setMensagem("Usuário atualizado com sucesso.");
            }

            setFormulario(formularioInicial);
            setUsuarioEditando(null);

            await carregarUsuarios();
        } catch (error) {
            setErro(error.message);
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluir(id) {
        const confirmar = window.confirm(
            "Tem certeza de que deseja excluir este usuário?"
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await excluirUsuario(id);
            setMensagem("Usuário excluído com sucesso.");

            if (usuarioEditando === id) {
                limparFormulario();
            }

            await carregarUsuarios();
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <section className="pagina-usuarios">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">ADMINISTRAÇÃO</span>
                    <h2>Usuários</h2>
                    <p>Cadastre e gerencie os usuários do Educamais.</p>
                </div>

                <button
                    className="botao-secundario"
                    onClick={carregarUsuarios}
                    disabled={carregando}
                >
                    ↻ Atualizar lista
                </button>
            </div>
            <div className="filtro-usuarios">
    <label htmlFor="busca-usuarios">
        Pesquisar usuário
    </label>

    <input
        id="busca-usuarios"
        type="search"
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
        placeholder="Digite um nome ou e-mail..."
    />
</div>

            {mensagem && (
                <div className="mensagem-sucesso">
                    {mensagem}
                </div>
            )}

            {erro && (
                <div className="mensagem-erro">
                    <strong>Não foi possível concluir a operação.</strong>
                    <p>{erro}</p>
                </div>
            )}

            <div className="formulario-card">
                <div className="tabela-cabecalho">
                    <h3>
                        {usuarioEditando === null
                            ? "Cadastrar usuário"
                            : `Editar usuário #${usuarioEditando}`}
                    </h3>

                    <p>
                        {usuarioEditando === null
                            ? "Preencha os dados para cadastrar um novo usuário."
                            : "Altere os dados desejados e salve as mudanças."}
                    </p>
                </div>

                <form className="formulario-usuario" onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="nome">Nome completo</label>

                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            value={formulario.nome}
                            onChange={handleChange}
                            placeholder="Digite o nome completo"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="email">E-mail</label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formulario.email}
                            onChange={handleChange}
                            placeholder="exemplo@email.com"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="senha">
                            Senha
                            {usuarioEditando !== null
                                ? " (opcional na edição)"
                                : ""}
                        </label>

                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            value={formulario.senha}
                            onChange={handleChange}
                            placeholder={
                                usuarioEditando === null
                                    ? "Digite uma senha com pelo menos 6 caracteres"
                                    : "Deixe vazio para manter a senha atual"
                            }
                            minLength={6}
                            required={usuarioEditando === null}
                            autoComplete={
                                usuarioEditando === null
                                    ? "new-password"
                                    : "off"
                            }
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
                                : usuarioEditando === null
                                    ? "Cadastrar usuário"
                                    : "Salvar alterações"}
                        </button>

                        {usuarioEditando !== null && (
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
                <div className="resumo-icone">♙</div>

                <div>
                    <p>Usuários cadastrados</p>
                    <strong>
                        {carregando ? "..." : usuarios.length}
                    </strong>
                </div>
            </div>

            <div className="tabela-card">
                <div className="tabela-cabecalho">
                    <h3>Lista de usuários</h3>
                    <p>Informações carregadas da API Educamais</p>
                </div>

                {carregando ? (
                    <p className="estado-vazio">
                        Carregando usuários...
                    </p>
                ) : usuariosFiltrados.length === 0 ? (
    <p className="estado-vazio">
        {usuarios.length === 0
            ? "Nenhum usuário cadastrado na API."
            : "Nenhum usuário corresponde à pesquisa."}
    </p>
                ) : usuarios.length === 0 ? (
                    <p className="estado-vazio">
                        Nenhum usuário cadastrado na API.
                    </p>
                ) : (
                    <div className="tabela-responsiva">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {usuariosFiltrados.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>#{usuario.id}</td>
                                        <td>{usuario.nome}</td>
                                        <td>{usuario.email}</td>

                                        <td>
                                            <div className="acoes-tabela">
                                                <button
                                                    className="botao-editar"
                                                    onClick={() =>
                                                        iniciarEdicao(usuario)
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="botao-excluir"
                                                    onClick={() =>
                                                        handleExcluir(usuario.id)
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

export default Usuarios;
