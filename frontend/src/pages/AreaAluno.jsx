import { useCallback, useEffect, useState } from "react";

import {
    buscarMeuPerfil,
    listarCursos,
    listarAtividades,
    listarMateriais
} from "../services/api";

import "../styles/AreaAluno.css";

function AreaAluno() {
    const [aluno, setAluno] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [materiais, setMateriais] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erroPerfil, setErroPerfil] = useState("");
    const [errosConteudo, setErrosConteudo] = useState({});

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErroPerfil("");
        setErrosConteudo({});

        const resultados = await Promise.allSettled([
            buscarMeuPerfil(),
            listarCursos(),
            listarAtividades(),
            listarMateriais()
        ]);

        const [
            resultadoPerfil,
            resultadoCursos,
            resultadoAtividades,
            resultadoMateriais
        ] = resultados;

        if (resultadoPerfil.status === "fulfilled") {
            setAluno(resultadoPerfil.value);
        } else {
            setAluno(null);
            setErroPerfil(
                resultadoPerfil.reason?.message ||
                "Não foi possível carregar seus dados."
            );
        }

        function processarLista(resultado, setLista, chave, nome) {
            if (
                resultado.status === "fulfilled" &&
                Array.isArray(resultado.value)
            ) {
                setLista(resultado.value);
                return;
            }

            setLista([]);

            const mensagem =
                resultado.status === "rejected"
                    ? resultado.reason?.message
                    : `A API não retornou uma lista válida de ${nome}.`;

            setErrosConteudo((anterior) => ({
                ...anterior,
                [chave]:
                    mensagem ||
                    `Não foi possível carregar ${nome}.`
            }));
        }

        processarLista(
            resultadoCursos,
            setCursos,
            "cursos",
            "cursos"
        );

        processarLista(
            resultadoAtividades,
            setAtividades,
            "atividades",
            "atividades"
        );

        processarLista(
            resultadoMateriais,
            setMateriais,
            "materiais",
            "materiais"
        );

        setCarregando(false);
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    function formatarData(data) {
        if (!data) {
            return "Não informada";
        }

        const dataTexto = String(data).slice(0, 10);
        const partes = dataTexto.split("-");

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        return dataTexto;
    }

    if (carregando) {
        return (
            <section className="pagina-usuarios area-aluno">
                <div className="tabela-card">
                    <div className="tabela-cabecalho">
                        <h2>Minha área</h2>
                        <p>Carregando seu perfil e conteúdo acadêmico...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="pagina-usuarios area-aluno">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">EDUCAMAIS</span>
                    <h2>Minha área</h2>
                    <p>
                        Consulte seus dados, cursos, atividades
                        e materiais de estudo.
                    </p>
                </div>

                <button
                    type="button"
                    className="botao-secundario"
                    onClick={carregarDados}
                    disabled={carregando}
                >
                    ↻ Atualizar dados
                </button>
            </div>

            <section className="tabela-card bloco-academico">
                <div className="tabela-cabecalho">
                    <h3>Meus dados</h3>
                    <p>Informações do seu cadastro no EducaMais.</p>
                </div>

                {erroPerfil ? (
                    <div className="mensagem-erro" role="alert">
                        <strong>Não foi possível carregar seu perfil.</strong>
                        <p>{erroPerfil}</p>
                    </div>
                ) : !aluno ? (
                    <p className="estado-vazio">
                        Nenhum dado de aluno foi encontrado.
                    </p>
                ) : (
                    <>
                        <div className="dados-aluno">
                            <div className="campo-dado">
                                <span>Nome completo</span>
                                <strong>{aluno.nome || "Não informado"}</strong>
                            </div>

                            <div className="campo-dado">
                                <span>E-mail</span>
                                <strong>{aluno.email || "Não informado"}</strong>
                            </div>

                            <div className="campo-dado">
                                <span>Matrícula</span>
                                <strong>
                                    {aluno.matricula || "Não informada"}
                                </strong>
                            </div>

                            <div className="campo-dado">
                                <span>Data de nascimento</span>
                                <strong>
                                    {formatarData(aluno.dataNascimento)}
                                </strong>
                            </div>

                            <div className="campo-dado">
                                <span>Telefone</span>
                                <strong>
                                    {aluno.telefone || "Não informado"}
                                </strong>
                            </div>

                            <div className="campo-dado">
                                <span>Endereço</span>
                                <strong>
                                    {aluno.endereco || "Não informado"}
                                </strong>
                            </div>

                            <div className="campo-dado">
                                <span>Situação do cadastro</span>
                                <strong>
                                    {aluno.ativo === false ? "Inativo" : "Ativo"}
                                </strong>
                            </div>
                        </div>
                    </>
                )}
            </section>

            <section className="tabela-card bloco-academico">
                <div className="tabela-cabecalho">
                    <h3>Meus cursos</h3>
                    <p>Cursos disponíveis para consulta.</p>
                </div>

                {errosConteudo.cursos ? (
                    <div className="mensagem-erro" role="alert">
                        {errosConteudo.cursos}
                    </div>
                ) : cursos.length === 0 ? (
                    <p className="estado-vazio">
                        Nenhum curso disponível no momento.
                    </p>
                ) : (
                    <div className="grade-academica">
                        {cursos.map((curso) => (
                            <article
                                className="item-academico"
                                key={curso.id}
                            >
                                <span className="item-identificador">
                                    Curso #{curso.id}
                                </span>

                                <h4>{curso.nome || "Curso sem nome"}</h4>

                                <p>
                                    {curso.descricao ||
                                        "Nenhuma descrição disponível."}
                                </p>

                                {Array.isArray(curso.disciplinas) &&
                                    curso.disciplinas.length > 0 && (
                                        <div className="etiquetas-disciplinas">
                                            {curso.disciplinas.map(
                                                (disciplina, indice) => (
                                                    <span
                                                        className="etiqueta-disciplina"
                                                        key={
                                                            disciplina.id ??
                                                            `${curso.id}-${indice}`
                                                        }
                                                    >
                                                        {disciplina.nome ||
                                                            `Disciplina #${disciplina.id}`}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="tabela-card bloco-academico">
                <div className="tabela-cabecalho">
                    <h3>Minhas atividades</h3>
                    <p>Consulte as atividades e suas datas de entrega.</p>
                </div>

                {errosConteudo.atividades ? (
                    <div className="mensagem-erro" role="alert">
                        {errosConteudo.atividades}
                    </div>
                ) : atividades.length === 0 ? (
                    <p className="estado-vazio">
                        Nenhuma atividade disponível no momento.
                    </p>
                ) : (
                    <div className="lista-academica">
                        {atividades.map((atividade) => (
                            <article
                                className="item-academico"
                                key={atividade.id}
                            >
                                <h4>
                                    {atividade.titulo ||
                                        `Atividade #${atividade.id}`}
                                </h4>

                                <p>
                                    {atividade.descricao ||
                                        "Nenhuma descrição disponível."}
                                </p>

                                <div className="detalhes-academicos">
                                    <span>
                                        <strong>Entrega:</strong>{" "}
                                        {formatarData(atividade.dataEntrega)}
                                    </span>

                                    {atividade.disciplina?.nome && (
                                        <span>
                                            <strong>Disciplina:</strong>{" "}
                                            {atividade.disciplina.nome}
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="tabela-card bloco-academico">
                <div className="tabela-cabecalho">
                    <h3>Materiais de estudo</h3>
                    <p>Consulte os materiais disponibilizados.</p>
                </div>

                {errosConteudo.materiais ? (
                    <div className="mensagem-erro" role="alert">
                        {errosConteudo.materiais}
                    </div>
                ) : materiais.length === 0 ? (
                    <p className="estado-vazio">
                        Nenhum material disponível no momento.
                    </p>
                ) : (
                    <div className="lista-academica">
                        {materiais.map((material) => (
                            <article
                                className="item-academico"
                                key={material.id}
                            >
                                <h4>
                                    {material.titulo ||
                                        `Material #${material.id}`}
                                </h4>

                                <p>
                                    {material.descricao ||
                                        "Nenhuma descrição disponível."}
                                </p>

                                {material.disciplina?.nome && (
                                    <p className="disciplina-material">
                                        <strong>Disciplina:</strong>{" "}
                                        {material.disciplina.nome}
                                    </p>
                                )}

                                {material.url && (
                                    <a
                                        className="link-material"
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Abrir material ↗
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}

export default AreaAluno;