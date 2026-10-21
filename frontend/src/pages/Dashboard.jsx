import { useCallback, useEffect, useState } from "react";

import {
    listarUsuarios,
    listarAlunos,
    listarCursos,
    listarDisciplinas,
    listarAtividades,
    listarMateriais
} from "../services/api";

import "../styles/Dashboard.css";

const indicadoresIniciais = {
    usuarios: null,
    alunos: null,
    cursos: null,
    atividades: null,
    materiais: null
};

function Dashboard({ setPagina }) {
    const [indicadores, setIndicadores] = useState(indicadoresIniciais);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregarResumo = useCallback(async () => {
        setCarregando(true);
        setErro("");

        const consultas = [
          
            {
                chave: "usuarios",
                nome: "usuários",
                executar: listarUsuarios
            },
            {
                chave: "alunos",
                nome: "alunos",
                executar: listarAlunos
            },
            {
                chave: "cursos",
                nome: "cursos",
                executar: listarCursos
            },
            {
                chave: "disciplinas",
                nome: "disciplinas",
                executar: listarDisciplinas
            },
            {
                chave: "atividades",
                nome: "atividades",
                executar: listarAtividades
            },
            {
                chave: "materiais",
                nome: "materiais",
                executar: listarMateriais
            }
            
            
        ];

        try {
            const resultados = await Promise.allSettled(
                consultas.map((consulta) => consulta.executar())
            );

            const novosIndicadores = {};
            const erros = [];

            resultados.forEach((resultado, indice) => {
                const consulta = consultas[indice];

                if (
                    resultado.status === "fulfilled" &&
                    Array.isArray(resultado.value)
                ) {
                    novosIndicadores[consulta.chave] =
                        resultado.value.length;
                } else {
                    novosIndicadores[consulta.chave] = null;

                    const motivo =
                        resultado.status === "rejected"
                            ? resultado.reason?.message
                            : "A API não retornou uma lista válida.";

                    erros.push(
                        `${consulta.nome}: ${
                            motivo || "não foi possível carregar os dados."
                        }`
                    );
                }
            });

            setIndicadores(novosIndicadores);

            if (erros.length > 0) {
                setErro(
                    "Alguns indicadores não puderam ser carregados:\n" +
                    erros.join("\n")
                );
            }
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível carregar os indicadores."
            );
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarResumo();
    }, [carregarResumo]);

    const cards = [
        {
            chave: "usuarios",
            titulo: "Total de usuários",
            icone: "♙",
            descricao: "Contas cadastradas no sistema",
            destino: "usuarios"
        },
        {
            chave: "alunos",
            titulo: "Alunos cadastrados",
            icone: "♧",
            descricao: "Registros de alunos",
            destino: "alunos"
        },
        {
            chave: "cursos",
            titulo: "Cursos cadastrados",
            icone: "▤",
            descricao: "Cursos disponíveis na plataforma",
            destino: "cursos"
        },
        {
            chave: "disciplinas",
            titulo: "Disciplinas cadastradas",
            icone: "▦",
            descricao: "Disciplinas registradas no sistema",
            destino: "disciplinas"
        },
        {
            chave: "atividades",
            titulo: "Atividades",
            icone: "✎",
            descricao: "Atividades cadastradas",
            destino: "atividades"
        },
        {
            chave: "materiais",
            titulo: "Materiais",
            icone: "▧",
            descricao: "Materiais de estudo cadastrados",
            destino: "materiais"
        }
    ];

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
                    {carregando
                        ? "Atualizando..."
                        : "↻ Atualizar dados"}
                </button>
            </div>

            {erro && (
                <div
                    className="mensagem-erro"
                    role="alert"
                    style={{ whiteSpace: "pre-line" }}
                >
                    <strong>Atenção aos indicadores</strong>
                    <p>{erro}</p>
                </div>
            )}

            <div className="dashboard-indicadores">
                {cards.map((card) => (
                    <article
                        className="dashboard-card"
                        key={card.chave}
                    >
                        <div className="dashboard-card-icone">
                            {card.icone}
                        </div>

                        <div className="dashboard-card-conteudo">
                            <span>{card.titulo}</span>

                            <strong>
                                {carregando
                                    ? "..."
                                    : indicadores[card.chave] === null
                                        ? "—"
                                        : indicadores[card.chave]}
                            </strong>

                            <small>{card.descricao}</small>

                            <button
                                type="button"
                                className="dashboard-link"
                                onClick={() => setPagina(card.destino)}
                            >
                                Acessar área →
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <section className="dashboard-secao">
                <div className="dashboard-secao-cabecalho">
                    <div>
                        <h3>Acesso rápido</h3>
                        <p>Escolha uma área administrativa.</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="dashboard-atalho"
                    onClick={() => setPagina("disciplinas")}
                >
                    <span className="dashboard-atalho-icone">▦</span>
                    <span>
                        <strong>Disciplinas</strong>
                        <small>Gerenciar disciplinas acadêmicas</small>
                    </span>
                    <span className="dashboard-seta">→</span>
                </button>

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
                            <small>Consultar e gerenciar alunos</small>
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
                        onClick={() => setPagina("atividades")}
                    >
                        <span className="dashboard-atalho-icone">✎</span>

                        <span>
                            <strong>Atividades</strong>
                            <small>Gerenciar atividades acadêmicas</small>
                        </span>

                        <span className="dashboard-seta">→</span>
                    </button>

                    <button
                        type="button"
                        className="dashboard-atalho"
                        onClick={() => setPagina("materiais")}
                    >
                        <span className="dashboard-atalho-icone">▧</span>

                        <span>
                            <strong>Materiais</strong>
                            <small>Organizar materiais de estudo</small>
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