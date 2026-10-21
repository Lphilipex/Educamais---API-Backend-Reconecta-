import { useCallback, useEffect, useState } from "react";

import {
    listarUsuarios,
    listarAlunos,
    listarCursos,
    listarDisciplinas,
    listarAtividades,
    listarMateriais
} from "../services/api";

import "../styles/Relatorios.css";

function Relatorios() {
    const [dados, setDados] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [erros, setErros] = useState([]);

    const carregarRelatorios = useCallback(async () => {
        setCarregando(true);
        setErros([]);

        const consultas = [
            { chave: "usuarios", titulo: "Usuários", executar: listarUsuarios },
            { chave: "alunos", titulo: "Alunos", executar: listarAlunos },
            { chave: "cursos", titulo: "Cursos", executar: listarCursos },
            {
                chave: "atividades",
                titulo: "Atividades",
                executar: listarAtividades
            },
            {
                chave: "materiais",
                titulo: "Materiais",
                executar: listarMateriais
            },
            {
                chave: "disciplinas",
                titulo: "Disciplinas",
                executar: listarDisciplinas
            },
        ];

        const resultados = await Promise.allSettled(
            consultas.map((consulta) => consulta.executar())
        );

        const novosDados = {};
        const novasErros = [];

        resultados.forEach((resultado, indice) => {
            const consulta = consultas[indice];

            if (
                resultado.status === "fulfilled" &&
                Array.isArray(resultado.value)
            ) {
                novosDados[consulta.chave] = resultado.value;
            } else {
                novosDados[consulta.chave] = null;

                novasErros.push({
                    titulo: consulta.titulo,
                    mensagem:
                        resultado.status === "rejected"
                            ? resultado.reason?.message ||
                              "Falha ao consultar os dados."
                            : "A API não retornou uma lista válida."
                });
            }
        });

        setDados(novosDados);
        setErros(novasErros);
        setCarregando(false);
    }, []);

    useEffect(() => {
        carregarRelatorios();
    }, [carregarRelatorios]);

    const total = (chave) =>
        Array.isArray(dados[chave]) ? dados[chave].length : null;

    const alunos = Array.isArray(dados.alunos) ? dados.alunos : [];

    const alunosAtivos =
        dados.alunos === null || dados.alunos === undefined
            ? null
            : alunos.filter((aluno) => aluno.ativo !== false).length;

    const alunosInativos =
        dados.alunos === null || dados.alunos === undefined
            ? null
            : alunos.filter((aluno) => aluno.ativo === false).length;

    const indicadores = [
        {
            titulo: "Usuários cadastrados",
            valor: total("usuarios"),
            icone: "♙",
            descricao: "Contas registradas no sistema"
        },
        {
            titulo: "Alunos cadastrados",
            valor: total("alunos"),
            icone: "♧",
            descricao: "Registros de alunos"
        },
        {
            titulo: "Alunos ativos",
            valor: alunosAtivos,
            icone: "✓",
            descricao: "Cadastros não marcados como inativos"
        },
        {
            titulo: "Alunos inativos",
            valor: alunosInativos,
            icone: "○",
            descricao: "Cadastros marcados como inativos"
        },
        {
            titulo: "Cursos",
            valor: total("cursos"),
            icone: "▤",
            descricao: "Cursos cadastrados"
        },
        {
            titulo: "Atividades",
            valor: total("atividades"),
            icone: "✎",
            descricao: "Atividades cadastradas"
        },
        {
            titulo: "Materiais",
            valor: total("materiais"),
            icone: "▧",
            descricao: "Materiais cadastrados"
        },
        {
            titulo: "Disciplinas",
            valor: total("disciplinas"),
            icone: "▦",
            descricao: "Disciplinas cadastradas"
        },
    ];

    return (
        <section className="pagina-relatorios">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">
                        GESTÃO E INDICADORES
                    </span>

                    <h2>Relatórios</h2>

                    <p>
                        Consulte um resumo dos registros do EducaMais.
                    </p>
                </div>

                <button
                    type="button"
                    className="botao-secundario"
                    onClick={carregarRelatorios}
                    disabled={carregando}
                >
                    {carregando ? "Atualizando..." : "↻ Atualizar dados"}
                </button>
            </div>

            {erros.length > 0 && (
                <div className="mensagem-erro" role="alert">
                    <strong>
                        Alguns indicadores não puderam ser carregados.
                    </strong>

                    {erros.map((erro) => (
                        <p key={erro.titulo}>
                            {erro.titulo}: {erro.mensagem}
                        </p>
                    ))}
                </div>
            )}

            <div className="relatorios-indicadores">
                {indicadores.map((indicador) => (
                    <article
                        className="relatorio-indicador"
                        key={indicador.titulo}
                    >
                        <span
                            className="relatorio-icone"
                            aria-hidden="true"
                        >
                            {indicador.icone}
                        </span>

                        <div>
                            <span className="relatorio-titulo">
                                {indicador.titulo}
                            </span>

                            <strong className="relatorio-valor">
                                {carregando
                                    ? "..."
                                    : indicador.valor === null
                                        ? "—"
                                        : indicador.valor}
                            </strong>

                            <small>{indicador.descricao}</small>
                        </div>
                    </article>
                ))}
            </div>

            <div className="relatorio-nota">
                <h3>Sobre estes indicadores</h3>

                <p>
                    Os totais refletem os registros retornados pela API
                    no momento da consulta. São contagens de registros,
                    não necessariamente de matrículas ou participações
                    individuais em cursos.
                </p>

                <p>
                    Os indicadores sem dados disponíveis aparecem como
                    um traço. Verifique a mensagem de erro apresentada
                    acima para identificar a consulta que falhou.
                </p>
            </div>
        </section>
    );
}

export default Relatorios;