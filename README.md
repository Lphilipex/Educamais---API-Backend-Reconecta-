# 📚 Educamais - API Backend (Reconecta)

API RESTful desenvolvida em **Java com Spring Boot** para o projeto final do programa **Reconecta**, alinhada com os Objetivos de Desenvolvimento Sustentável (ODS) da ONU, especificamente o **ODS 4 – Educação de Qualidade**.

---

## 🌎 Alinhamento com o ODS 4 (Educação de Qualidade)

* **O Problema Identificado:** 
  Plataformas e iniciativas educacionais frequentemente enfrentam barreiras de infraestrutura tecnológica. Há uma carência de sistemas de backend robustos, seguros e padronizados para gerenciar de forma integrada informações essenciais do ecossistema escolar (como usuários, matrizes curriculares, materiais de estudo e cronogramas de tarefas). A ausência de uma API centralizada dificulta o desenvolvimento de aplicações voltadas à inclusão digital e à gestão eficiente do aprendizado.

* **A Solução Tecnológica:** 
  O **Educamais** atua como o motor de dados (backend) para o ecossistema educacional. A API fornece uma arquitetura relacional segura e estruturada, permitindo o gerenciamento completo de usuários, disciplinas, conteúdos didáticos e atividades, servindo de base sólida para futuras interfaces (web ou mobile) focadas em melhorar a qualidade e a acessibilidade da educação.

---

## 🗂️ Planejamento do Projeto (Sprint 1)

Para organizar o desenvolvimento da API do **Educamais**, o projeto seguiu uma metodologia ágil dividida nas etapas do programa:

### 1. Gestão e Organização
* Utilização de ferramentas visuais (**Trello / Notion**) estruturadas em um quadro Kanban com as colunas: *Backlog*, *Em Desenvolvimento* e *Concluído*.

### 2. Definição do Escopo e Entidades
O sistema foi planejado para conter 4 entidades principais interligadas em banco de dados relacional:
* **Usuario:** Gerencia os perfis cadastrados no sistema[cite: 13].
* **Disciplina:** Matérias acadêmicas vinculadas aos usuários[cite: 12].
* **Material:** Conteúdos e apostilas de estudo vinculadas às disciplinas[cite: 11].
* **Atividade:** Tarefas e prazos escolares associados às disciplinas[cite: 14].

### 3. Arquitetura de Rotas (Endpoints) Planejadas
| Recurso | Método HTTP | Rota (Endpoint) | Descrição |
| :--- | :--- | :--- | :--- |
| **Usuários** | GET / POST / PUT / DELETE | `/usuarios` | Gerenciamento de cadastros de usuários[cite: 13] |
| **Disciplinas** | GET / POST / PUT / DELETE | `/disciplinas` | Gerenciamento de matérias escolares[cite: 12] |
| **Materiais** | GET / POST / PUT / DELETE | `/materiais` | Repositório de conteúdos didáticos[cite: 11] |
| **Atividades** | GET / POST / PUT / DELETE | `/atividades` | Controle de tarefas e prazos[cite: 14] |

---

## 🚀 Desenvolvimento e Execução (Sprint 2 e 3)

### 🛠️ Tecnologias Utilizadas
* **Java 17**[cite: 1, 7]
* **Spring Boot (v4.1.1)**
* **Spring Data JPA** (Persistência de dados)
* **Spring Validation** (Validação de dados de entrada)[cite: 7]
* **Spring Web MVC** (Construção dos endpoints REST)[cite: 7]
* **MySQL Connector** (Banco de dados relacional)[cite: 7]
* **SpringDoc OpenAPI (Swagger)** (Documentação interativa)[cite: 7]
* **Maven Wrapper**[cite: 5, 6]

### 📦 Como Executar o Projeto Localmente
1. Clone o repositório:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd educamais
Configure as credenciais do seu banco de dados no arquivo src/main/resources/application.properties:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/educamais?useSSL=false&serverTimezone=UTC
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
Execute a aplicação usando o Maven Wrapper:

No Linux/Mac:

Bash
./mvnw spring-boot:run
No Windows (PowerShell / CMD):

DOS
mvnw.cmd spring-boot:run
A API estará rodando em: http://localhost:8080

📖 Documentação da API (Swagger - Sprint 3)
A documentação interativa da API foi gerada automaticamente utilizando o SpringDoc OpenAPI[cite: 7].

Após iniciar a aplicação, você pode testar todas as rotas e endpoints diretamente pelo navegador acessando:
🔗 http://localhost:8080/swagger-ui/index.html

👥 Autor
Desenvolvido para o programa Reconecta.
