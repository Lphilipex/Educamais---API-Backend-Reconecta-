
import { useState } from "react";
import { cadastrarAluno } from "../services/api";
import "../styles/CadastroAluno.css";

function CadastroAluno({ aoVoltar }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [matricula, setMatricula] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setErro("");
        setSucesso("");

        if (senha.length < 6) {
            setErro("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            await cadastrarAluno({
                nome,
                email,
                matricula,
                dataNascimento: dataNascimento || null,
                telefone,
                endereco,
                conta: {
                    senha
                }
            });

            setSucesso(
                "Cadastro realizado com sucesso! Agora você pode entrar."
            );

            setNome("");
            setEmail("");
            setMatricula("");
            setDataNascimento("");
            setTelefone("");
            setEndereco("");
            setSenha("");
            setConfirmarSenha("");
        } catch (error) {
            setErro(error.message || "Não foi possível realizar o cadastro.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="cadastro-aluno-container">
            <section className="cadastro-aluno-card">
                <div className="cadastro-aluno-cabecalho">
                    <div className="login-marca">
                        <div className="login-marca-icone">E</div>
                        <span>EducaMais</span>
                    </div>

                    <span className="login-sobretitulo">
                        EDUCAÇÃO PARA TODOS
                    </span>

                    <h1>Crie sua conta</h1>

                    <p>
                        Preencha seus dados para se cadastrar na plataforma.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="cadastro-aluno-grid">
                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-nome">Nome completo *</label>
                            <input
                                id="cadastro-nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                maxLength={150}
                                autoComplete="name"
                                required
                                disabled={carregando}
                            />
                        </div>

                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-email">E-mail *</label>
                            <input
                                id="cadastro-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                disabled={carregando}
                            />
                        </div>

                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-matricula">Matrícula *</label>
                            <input
                                id="cadastro-matricula"
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                                required
                                disabled={carregando}
                            />
                        </div>

                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-nascimento">
                                Data de nascimento
                            </label>
                            <input
                                id="cadastro-nascimento"
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                autoComplete="bday"
                                disabled={carregando}
                            />
                        </div>

                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-telefone">Telefone</label>
                            <input
                                id="cadastro-telefone"
                                type="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                autoComplete="tel"
                                disabled={carregando}
                            />
                        </div>

                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-endereco">Endereço</label>
                            <input
                                id="cadastro-endereco"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                maxLength={255}
                                autoComplete="street-address"
                                disabled={carregando}
                            />
                        </div>

                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-senha">Senha *</label>
                            <input
                                id="cadastro-senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                minLength={6}
                                autoComplete="new-password"
                                required
                                disabled={carregando}
                            />
                        </div>

                        <div className="cadastro-aluno-campo">
                            <label htmlFor="cadastro-confirmar-senha">
                                Confirmar senha *
                            </label>
                            <input
                                id="cadastro-confirmar-senha"
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                minLength={6}
                                autoComplete="new-password"
                                required
                                disabled={carregando}
                            />
                        </div>
                    </div>

                    {erro && (
                        <p className="cadastro-aluno-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    {sucesso && (
                        <p className="cadastro-aluno-sucesso" role="status">
                            {sucesso}
                        </p>
                    )}

                    <button
                        className="login-botao"
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando ? "Cadastrando..." : "Criar minha conta"}
                    </button>

                    <button
                        className="cadastro-aluno-voltar"
                        type="button"
                        onClick={aoVoltar}
                        disabled={carregando}
                    >
                        Já tenho uma conta — voltar ao login
                    </button>
                </form>
            </section>
        </main>
    );
}

export default CadastroAluno;
