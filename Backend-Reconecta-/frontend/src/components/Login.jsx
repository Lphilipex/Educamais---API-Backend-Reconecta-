
import { useState } from "react";
import { fazerLogin } from "../services/api";
import "../styles/Login.css";

function Login({ aoEntrar, aoCadastrar }) {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            const usuario = await fazerLogin(email, senha);
            aoEntrar(usuario);
        } catch (error) {
            setErro(error.message || "Não foi possível realizar o login.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="login-container">
            <section className="login-apresentacao">
                <div className="login-marca">
                    <div className="login-marca-icone">E</div>
                    <span>EducaMais</span>
                </div>

                <div className="login-texto">
                    <span className="login-sobretitulo">
                        EDUCAÇÃO PARA TODOS
                    </span>

                    <h1>
                        O conhecimento transforma o futuro.
                    </h1>

                    <p>
                        Um espaço para apoiar a educação,
                        ampliar oportunidades e contribuir para
                        um futuro com mais igualdade.
                    </p>
                </div>

                <div className="login-ods">
                    <span>ODS 4</span>
                    <p>
                        Educação de qualidade: educação inclusiva,
                        equitativa e oportunidades de aprendizagem
                        para todos.
                    </p>
                </div>
            </section>

            <section className="login-area-formulario">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-cabecalho">
                        <span className="login-bem-vindo">
                            BEM-VINDO(A)
                        </span>

                        <h2>Acesse sua conta</h2>

                        <p>
                            Informe seus dados para continuar no EducaMais.
                        </p>
                    </div>

                    <div className="login-campo">
                        <label htmlFor="email">E-mail</label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seuemail@exemplo.com"
                            autoComplete="username"
                            required
                            disabled={carregando}
                        />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="senha">Senha</label>

                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            required
                            disabled={carregando}
                        />
                    </div>

                    {erro && (
                        <p className="login-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    <button
                        className="login-botao"
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando ? "Entrando..." : "Entrar na plataforma"}
                    </button>

                    <div className="login-cadastro">
                        <p>Ainda não tem uma conta?</p>

                        <button
                            type="button"
                            className="login-cadastro-botao"
                            onClick={aoCadastrar}
                        >
                            Criar minha conta
                        </button>
                    </div>
                </form>

                <footer className="login-rodape">
                    EducaMais · Projeto acadêmico · ODS 4
                </footer>
            </section>
        </main>
    );
}

export default Login;
