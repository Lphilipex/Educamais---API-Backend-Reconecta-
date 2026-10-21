
import { useCallback, useEffect, useState } from "react";
import { listarUsuarios } from "../services/api";
import "../styles/Dashboard.css";

function Dashboard({ setPagina }) {
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregarResumo = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const dados = await listarUsuarios();

            setTotalUsuarios(
                Array.isArray(dados) ? dados.length : 0
            );
        } catch (error) {
            setErro(
                error.message || "Não foi possível carregar os indicadores."
            );
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarResumo();
    }, [carregarResumo]);

    return (
        <section className="pagina-dashboard">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">
                        VISÃO GERAL
                    </span>

                    <h2>Dashboard</h2>

                    <p>
                        Acompanhe os principais indicadores do EducaMais.
                    </p>
                </div>

                <button
                    type="button"
                    className="botao-secundario"
                    onClick={carregarResumo}
                    disabled={carregando}
                >
                    {carregando ? "Atualizando..." : "↻ Atualizar dados"}
                </button>
            </div>

            {erro && (
                <div className="mensagem-erro" role="alert">
                    <strong>Não foi possível carregar os dados.</strong>
                    <p>{erro}</p>
                </div>
            )}

            <div className="dashboard-indicadores">
                <article className="dashboard-card">
                    <div className="dashboard-card-icone">♙</div>

                    <div className="dashboard-card-conteudo">
                        <span>Total de usuários</span>

                        <strong>
                            {carregando ? "..." : erro ? "—" : totalUsuarios}
                        </strong>

                        <small>Usuários cadastrados no sistema</small>
                    </div>
                </article>

                <article className="dashboard-card dashboard-card-informativo">
                    <div className="dashboard-card-icone">◎</div>

                    <div className="dashboard-card-conteudo">
                        <span>Plataforma</span>
                        <strong>EducaMais</strong>
                        <small>Projeto acadêmico voltado à educação</small>
                    </div>
                </article>

                <article className="dashboard-card dashboard-card-informativo">
                    <div className="dashboard-card-icone">✦</div>

                    <div className="dashboard-card-conteudo">
                        <span>Objetivo global</span>
                        <strong>ODS 4</strong>
                        <small>Educação de qualidade</small>
                    </div>
                </article>
            </div>

            <section className="dashboard-secao">
                <div className="dashboard-secao-cabecalho">
                    <div>
                        <h3>Acesso rápido</h3>
                        <p>Escolha uma área para continuar.</p>
                    </div>
                </div>

                <div className="dashboard-atalhos">
                    <button
                        type="button"
                        className="dashboard-atalho"
                        onClick={() => setPagina("usuarios")}
                    >
                        <span className="dashboard-atalho-icone">♙</span>
                        <span>
                            <strong>Usuários</strong>
                            <small>Gerenciar contas de acesso</small>
                        </span>
                        <span className="dashboard-seta">→</span>
                    </button>

                    <button
                        type="button"
                        className="dashboard-atalho"
                        onClick={() => setPagina("alunos")}
                    >
                        <span className="dashboard-atalho-icone">♧</span>
                        <span>
                            <strong>Alunos</strong>
                            <small>Área de gestão de alunos</small>
                        </span>
                        <span className="dashboard-seta">→</span>
                    </button>

                    <button
                        type="button"
                        className="dashboard-atalho"
                        onClick={() => setPagina("cursos")}
                    >
                        <span className="dashboard-atalho-icone">▤</span>
                        <span>
                            <strong>Cursos</strong>
                            <small>Organizar cursos educacionais</small>
                        </span>
                        <span className="dashboard-seta">→</span>
                    </button>

                    <button
                        type="button"
                        className="dashboard-atalho"
                        onClick={() => setPagina("relatorios")}
                    >
                        <span className="dashboard-atalho-icone">▥</span>
                        <span>
                            <strong>Relatórios</strong>
                            <small>Consultar informações do sistema</small>
                        </span>
                        <span className="dashboard-seta">→</span>
                    </button>
                </div>
            </section>

            <section className="dashboard-ods">
                <div className="dashboard-ods-selo">ODS 4</div>

                <div>
                    <h3>Educação de qualidade</h3>

                    <p>
                        Contribuir para uma educação inclusiva e equitativa,
                        ampliando oportunidades de aprendizagem para todos.
                    </p>
                </div>
            </section>
        </section>
    );
}

export default Dashboard;
