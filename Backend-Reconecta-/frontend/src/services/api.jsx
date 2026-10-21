
const API_URL = "http://localhost:8080/usuarios";
const AUTH_URL = "http://localhost:8080/auth";

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
const ALUNOS_URL = "http://localhost:8080/alunos";
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


