import "../styles/MenuLateral.css";
function MenuLateral({ pagina, setPagina, perfil }) {
    const itensAdministrador = [
        { id: "dashboard", icone: "⌂", nome: "Dashboard" },
        { id: "usuarios", icone: "♙", nome: "Usuários" },
        { id: "alunos", icone: "♧", nome: "Alunos" },
        { id: "cursos", icone: "▤", nome: "Cursos" },
        { id: "relatorios", icone: "▥", nome: "Relatórios" }
    ];

    const itensAluno = [
        { id: "area-aluno", icone: "♙", nome: "Minha área" }
    ];

    const itensMenu =
        perfil === "ADMIN" ? itensAdministrador : itensAluno;

    return (
        <aside className="menu-lateral">
            <div className="menu-titulo">MENU PRINCIPAL</div>

            <nav aria-label="Navegação principal">
                {itensMenu.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`menu-item ${
                            pagina === item.id ? "ativo" : ""
                        }`}
                        onClick={() => setPagina(item.id)}
                    >
                        <span className="menu-item-icone" aria-hidden="true">
                            {item.icone}
                        </span>

                        <span>{item.nome}</span>
                    </button>
                ))}
            </nav>

            <div className="menu-ods">
                <span className="ods-numero">ODS 4</span>

                <h3>Educação de qualidade</h3>

                <p>
                    Promover oportunidades de aprendizagem para todos.
                </p>
            </div>
        </aside>
    );
}

export default MenuLateral;
