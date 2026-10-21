import "../styles/Cabecalho.css";

function Cabecalho({ aoSair }) {
    return (
        <header className="cabecalho">
            <div className="marca">
                <div className="marca-icone">E</div>

                <div>
                    <h1>EducaMais</h1>
                    <p>Educação que transforma</p>
                </div>
            </div>

            <div className="cabecalho-acoes">
                <div className="perfil">
                    <span className="perfil-status"></span>
                    <span>Portal Educacional</span>
                </div>

                <button
                    type="button"
                    className="botao-sair"
                    onClick={aoSair}
                >
                    Sair
                </button>
            </div>
        </header>
    );
}

export default Cabecalho;