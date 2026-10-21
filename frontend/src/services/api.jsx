const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const API_URL = `${BASE_URL}/usuarios`;
const AUTH_URL = `${BASE_URL}/auth`;
const ALUNOS_URL = `${BASE_URL}/alunos`;
const CURSOS_URL = `${BASE_URL}/cursos`;
const DISCIPLINAS_URL = `${BASE_URL}/disciplinas`;
const ATIVIDADES_URL = `${BASE_URL}/atividades`;
const MATERIAIS_URL = `${BASE_URL}/materiais`;

// Recupera o token salvo após o login.
function obterToken() {
    return localStorage.getItem("token");
}

// Monta os cabeçalhos das requisições.
function obterCabecalhos(incluirJson = false) {
    const cabecalhos = {};

    if (incluirJson) {
        cabecalhos["Content-Type"] = "application/json";
    }

    const token = obterToken();

    if (token) {
        cabecalhos.Authorization = `Bearer ${token}`;
    }

    return cabecalhos;
}

// Lê a resposta sem presumir que ela contém JSON.
async function lerResposta(resposta) {
    const texto = await resposta.text();

    if (!texto) {
        return null;
    }

    try {
        return JSON.parse(texto);
    } catch {
        return texto;
    }
}

function obterMensagemErro(dados, mensagemPadrao) {
    if (typeof dados === "string" && dados.trim()) {
        return dados;
    }

    if (dados?.erro) {
        return dados.erro;
    }

    if (dados?.message) {
        return dados.message;
    }

    if (Array.isArray(dados?.erros)) {
        return dados.erros.join("\n");
    }

    return mensagemPadrao;
}
// LOGIN
export async function fazerLogin(email, senha) {
    const resposta = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível realizar o login.")
        );
    }

    if (!dados?.token) {
        throw new Error("A API não retornou o token de autenticação.");
    }

    localStorage.setItem("token", dados.token);

    return dados;
}
// LISTAR USUÁRIOS
export async function listarUsuarios() {
    const resposta = await fetch(API_URL, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível carregar os usuários.")
        );
    }

    return dados;
}
// CADASTRAR USUÁRIO
export async function cadastrarUsuario(usuario) {
    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: obterCabecalhos(true),
        body: JSON.stringify(usuario)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível cadastrar o usuário.")
        );
    }

    return dados;
}
// ATUALIZAR USUÁRIO
export async function atualizarUsuario(id, usuario) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: obterCabecalhos(true),
        body: JSON.stringify(usuario)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível atualizar o usuário.")
        );
    }

    return dados;
}
// EXCLUIR USUÁRIO
export async function excluirUsuario(id) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível excluir o usuário.")
        );
    }
}
// SAIR DA CONTA
export function fazerLogout() {
    localStorage.removeItem("token");
}

// LISTAR ALUNOS
export async function listarAlunos() {
    const resposta = await fetch(ALUNOS_URL, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível carregar os alunos.")
        );
    }

    return dados;
}
// BUSCAR ALUNO POR ID
export async function buscarAlunoPorId(id) {
    const resposta = await fetch(`${ALUNOS_URL}/${id}`, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível localizar o aluno.")
        );
    }

    return dados;
}
// CADASTRAR ALUNO
export async function cadastrarAluno(aluno) {
    const resposta = await fetch(ALUNOS_URL, {
        method: "POST",
        headers: obterCabecalhos(true),
        body: JSON.stringify(aluno)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível cadastrar o aluno.")
        );
    }

    return dados;
}
// ATUALIZAR ALUNO
export async function atualizarAluno(id, aluno) {
    const resposta = await fetch(`${ALUNOS_URL}/${id}`, {
        method: "PUT",
        headers: obterCabecalhos(true),
        body: JSON.stringify(aluno)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível atualizar o aluno.")
        );
    }

    return dados;
}
// ALTERAR SITUAÇÃO DO ALUNO
export async function alterarSituacaoAluno(id, ativo) {
    const resposta = await fetch(`${ALUNOS_URL}/${id}/situacao`, {
        method: "PATCH",
        headers: obterCabecalhos(true),
        body: JSON.stringify({ ativo })
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível alterar a situação do aluno.")
        );
    }

    return dados;
}
// EXCLUIR ALUNO
export async function excluirAluno(id) {
    const resposta = await fetch(`${ALUNOS_URL}/${id}`, {
        method: "DELETE",
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível excluir o aluno.")
        );
    }
}
 // BUSCAR PERFIL DO ALUNO AUTENTICADO
export async function buscarMeuPerfil() {
    const resposta = await fetch(`${ALUNOS_URL}/meu-perfil`, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível carregar seu perfil de aluno."
            )
        );
    }

    return dados;
}
// LISTAR CURSOS
export async function listarCursos() {
    const resposta = await fetch(CURSOS_URL, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível carregar os cursos.")
        );
    }

    return dados;
}

// LISTAR DISCIPLINAS PARA O FORMULÁRIO DE CURSOS
export async function listarDisciplinas() {
    const resposta = await fetch(DISCIPLINAS_URL, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível carregar as disciplinas."
            )
        );
    }

    return dados;
}

// CADASTRAR CURSO
export async function cadastrarCurso(curso) {
    const resposta = await fetch(CURSOS_URL, {
        method: "POST",
        headers: obterCabecalhos(true),
        body: JSON.stringify(curso)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível cadastrar o curso.")
        );
    }

    return dados;
}

// ATUALIZAR CURSO
export async function atualizarCurso(id, curso) {
    const resposta = await fetch(`${CURSOS_URL}/${id}`, {
        method: "PUT",
        headers: obterCabecalhos(true),
        body: JSON.stringify(curso)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível atualizar o curso.")
        );
    }

    return dados;
}

// EXCLUIR CURSO
export async function excluirCurso(id) {
    const resposta = await fetch(`${CURSOS_URL}/${id}`, {
        method: "DELETE",
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível excluir o curso.")
        );
    }
}
// ENDPOINTS DE ATIVIDADES E MATERIAIS

// LISTAR ATIVIDADES
export async function listarAtividades() {
    const resposta = await fetch(ATIVIDADES_URL, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível carregar as atividades."
            )
        );
    }

    return dados;
}

// LISTAR MATERIAIS
export async function listarMateriais() {
    const resposta = await fetch(MATERIAIS_URL, {
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível carregar os materiais."
            )
        );
    }

    return dados;
}
// CADASTRAR ATIVIDADE
export async function cadastrarAtividade(atividade) {
    const resposta = await fetch(ATIVIDADES_URL, {
        method: "POST",
        headers: obterCabecalhos(true),
        body: JSON.stringify(atividade)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível cadastrar a atividade."
            )
        );
    }

    return dados;
}

// ATUALIZAR ATIVIDADE
export async function atualizarAtividade(id, atividade) {
    const resposta = await fetch(`${ATIVIDADES_URL}/${id}`, {
        method: "PUT",
        headers: obterCabecalhos(true),
        body: JSON.stringify(atividade)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível atualizar a atividade."
            )
        );
    }

    return dados;
}

// EXCLUIR ATIVIDADE
export async function excluirAtividade(id) {
    const resposta = await fetch(`${ATIVIDADES_URL}/${id}`, {
        method: "DELETE",
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível excluir a atividade."
            )
        );
    }
}
// CADASTRAR MATERIAL
export async function cadastrarMaterial(material) {
    const resposta = await fetch(MATERIAIS_URL, {
        method: "POST",
        headers: obterCabecalhos(true),
        body: JSON.stringify(material)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível cadastrar o material.")
        );
    }

    return dados;
}

// ATUALIZAR MATERIAL
export async function atualizarMaterial(id, material) {
    const resposta = await fetch(`${MATERIAIS_URL}/${id}`, {
        method: "PUT",
        headers: obterCabecalhos(true),
        body: JSON.stringify(material)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível atualizar o material.")
        );
    }

    return dados;
}

// EXCLUIR MATERIAL
export async function excluirMaterial(id) {
    const resposta = await fetch(`${MATERIAIS_URL}/${id}`, {
        method: "DELETE",
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(dados, "Não foi possível excluir o material.")
        );
    }
}
// CADASTRAR DISCIPLINA
export async function cadastrarDisciplina(disciplina) {
    const resposta = await fetch(DISCIPLINAS_URL, {
        method: "POST",
        headers: obterCabecalhos(true),
        body: JSON.stringify(disciplina)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível cadastrar a disciplina."
            )
        );
    }

    return dados;
}

// ATUALIZAR DISCIPLINA
export async function atualizarDisciplina(id, disciplina) {
    const resposta = await fetch(`${DISCIPLINAS_URL}/${id}`, {
        method: "PUT",
        headers: obterCabecalhos(true),
        body: JSON.stringify(disciplina)
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível atualizar a disciplina."
            )
        );
    }

    return dados;
}

// EXCLUIR DISCIPLINA
export async function excluirDisciplina(id) {
    const resposta = await fetch(`${DISCIPLINAS_URL}/${id}`, {
        method: "DELETE",
        headers: obterCabecalhos()
    });

    const dados = await lerResposta(resposta);

    if (!resposta.ok) {
        throw new Error(
            obterMensagemErro(
                dados,
                "Não foi possível excluir a disciplina."
            )
        );
    }
}


