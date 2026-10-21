
import { useEffect, useState } from "react";
import { buscarMeuPerfil } from "../services/api";
import "../styles/AreaAluno.css";

function AreaAluno() {
    const [aluno, setAluno] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarPerfil() {
        setCarregando(true);
        setErro("");

        try {
            const dados = await buscarMeuPerfil();
            setAluno(dados);
        } catch (error) {
            setErro(
                error.message ||
                "Não foi possível carregar seus dados."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarPerfil();
    }, []);

    function formatarData(data) {
        if (!data) {
            return "Não informado";
        }

        // Evita problemas de fuso horário com datas no formato YYYY-MM-DD.
        const partes = data.split("-");

        if (partes.length === 3) {
            return `${partes[2].slice(0, 2)}/${partes[1]}/${partes[0]}`;
        }

        return data;
    }

    if (carregando) {
        return (
            <section className="pagina-usuarios">
                <div className="tabela-card">
                    <div className="tabela-cabecalho">
                        <h2>Minha área</h2>
                        <p>Carregando seus dados...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (erro) {
        return (
            <section className="pagina-usuarios">
                <div className="tabela-card">
                    <div className="tabela-cabecalho">
                        <h2>Minha área</h2>
                        <p>{erro}</p>

                        <button
                            type="button"
                            className="botao-secundario"
                            onClick={carregarPerfil}
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!aluno) {
        return (
            <section className="pagina-usuarios">
                <div className="tabela-card">
                    <div className="tabela-cabecalho">
                        <h2>Minha área</h2>
                        <p>Nenhum dado de aluno foi encontrado.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="pagina-usuarios">
            <div className="pagina-cabecalho">
                <div>
                    <span className="sobretitulo">
                        EDUCAMais
                    </span>

                    <h2>Minha área</h2>

                    <p>
                        Consulte seus dados cadastrais e sua situação
                        no EducaMais.
                    </p>
                </div>
            </div>

            <div className="tabela-card">
                <div className="tabela-cabecalho">
                    <h3>Meus dados</h3>

                    <p>
                        Estas informações correspondem ao seu cadastro.
                    </p>
                </div>

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
                            {aluno.matricula || "Não informado"}
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
                            {aluno.ativo ? "Ativo" : "Inativo"}
                        </strong>
                    </div>
                </div>

                <div className="tabela-acoes">
                    <button
                        type="button"
                        className="botao-secundario"
                        onClick={carregarPerfil}
                    >
                        Atualizar dados
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AreaAluno;
