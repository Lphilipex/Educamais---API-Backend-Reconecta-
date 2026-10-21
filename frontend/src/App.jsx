import { useState } from "react";

import Cabecalho from "./components/Cabecalho";
import MenuLateral from "./components/MenuLateral";
import Usuarios from "./pages/Usuarios";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import AreaAluno from "./pages/AreaAluno";
import CadastroAluno from "./components/CadastroAluno";
import Cursos from "./pages/Cursos";
import Atividades from "./pages/Atividades";
import Materiais from "./pages/Materiais";
import Relatorios from "./pages/Relatorios";
import Disciplinas from "./pages/Disciplinas";
// CSS global e layout compartilhado
import "./App.css";
import "./styles/Layout.css";

const paginasDisponiveis = {
    
    relatorios: {
        titulo: "Relatórios",
        descricao: "Área de indicadores e relatórios educacionais."
    }
};

function App() {
    const [telaPublica, setTelaPublica] = useState("login");

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const [perfil, setPerfil] = useState(
        () => localStorage.getItem("perfil")
    );

    const [pagina, setPagina] = useState(
        () =>
            localStorage.getItem("perfil") === "ADMIN"
                ? "dashboard"
                : "area-aluno"
    );

    // Realiza o login do usuário.
    function entrar(usuario) {
        if (!usuario?.token || !usuario?.perfil) {
            console.error(
                "A API precisa retornar o token e o perfil do usuário."
            );
            return;
        }

        const perfilUsuario = String(usuario.perfil).toUpperCase();

        if (!["ADMIN", "ALUNO"].includes(perfilUsuario)) {
            console.error("Perfil de usuário desconhecido.");
            return;
        }

        localStorage.setItem("token", usuario.token);
        localStorage.setItem("perfil", perfilUsuario);

        if (usuario.nome) {
            localStorage.setItem("usuarioNome", usuario.nome);
        }

        if (usuario.email) {
            localStorage.setItem("usuarioEmail", usuario.email);
        }

        setToken(usuario.token);
        setPerfil(perfilUsuario);

        setPagina(
            perfilUsuario === "ADMIN"
                ? "dashboard"
                : "area-aluno"
        );

        setTelaPublica("login");
    }

    // Encerra a sessão e retorna à tela de login.
    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("perfil");
        localStorage.removeItem("usuarioNome");
        localStorage.removeItem("usuarioEmail");

        setToken(null);
        setPerfil(null);
        setPagina("dashboard");
        setTelaPublica("login");
    }

    // Usuário sem sessão: mostra login ou cadastro.
    if (!token || !perfil) {
        if (telaPublica === "cadastro") {
            return (
                <CadastroAluno
                    aoVoltar={() => setTelaPublica("login")}
                />
            );
        }

        return (
            <Login
                aoEntrar={entrar}
                aoCadastrar={() => setTelaPublica("cadastro")}
            />
        );
    }

    // Área administrativa.
    if (perfil === "ADMIN") {
        return (
            <div className="aplicacao">
                <Cabecalho aoSair={sair} />

                <div className="estrutura">
                    <MenuLateral
                        pagina={pagina}
                        setPagina={setPagina}
                        perfil={perfil}
                    />

                    <main className="conteudo">
                        {pagina === "disciplinas" && <Disciplinas />}
                        {pagina === "relatorios" && <Relatorios />}
                        {pagina === "materiais" && <Materiais />}
                        {pagina === "atividades" && <Atividades />}
                        {pagina === "cursos" && <Cursos />}
                        {pagina === "dashboard" && (
                            <Dashboard setPagina={setPagina} />
                        )}

                        {pagina === "usuarios" && <Usuarios />}

                        {pagina === "alunos" && <Alunos />}

                        {paginasDisponiveis[pagina] && (
                            <section className="pagina-usuarios">
                                <div className="pagina-cabecalho">
                                    <div>
                                        <span className="sobretitulo">
                                            EDUCAMais
                                        </span>

                                        <h2>
                                            {paginasDisponiveis[pagina].titulo}
                                        </h2>

                                        <p>
                                            {paginasDisponiveis[pagina].descricao}
                                        </p>
                                    </div>
                                </div>

                                <div className="tabela-card">
                                    <div className="tabela-cabecalho">
                                        <h3>Página em desenvolvimento</h3>

                                        <p>
                                            Estamos preparando esta área do
                                            EducaMais. As funcionalidades serão
                                            implementadas nas próximas etapas.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </main>
                </div>

                <footer className="rodape">
                    <span>
                        EducaMais · Projeto acadêmico · ODS 4
                    </span>
                </footer>
            </div>
        );
    }

    // Área pessoal do aluno.
    if (perfil === "ALUNO") {
        return (
            <div className="aplicacao">
                <Cabecalho aoSair={sair} />

                <div className="estrutura">
                    <MenuLateral
                        pagina={pagina}
                        setPagina={setPagina}
                        perfil={perfil}
                    />

                    <main className="conteudo">
                        {pagina === "area-aluno" && <AreaAluno />}
                        {pagina === "atividades" && <Atividades />}
                        {pagina === "materiais" && <Materiais somenteConsulta />}
                    </main>
                </div>

                <footer className="rodape">
                    <span>
                        EducaMais · Projeto acadêmico · ODS 4
                    </span>
                </footer>
            </div>
        );
    }

    // Perfil inválido: encerra a sessão local.
    sair();

    return <Login aoEntrar={entrar} />;
}

export default App;