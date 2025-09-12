# API TODO (ASP.NET 9 + EF Core + PostgreSQL)

**Descrição:**
API RESTful para gerenciar tarefas (tasks) com CRUD, filtros por categoria/usuário e autenticação JWT. Projeto em **.NET 9 (net9.0)**, Entity Framework Core e PostgreSQL. Pode ser executado **100% local** ou via **Docker Compose**. ⚡

---

## Requisitos

* .NET SDK 9.x (net9.0) instalado localmente para execução local.
* Docker & Docker Compose (se executar via container).
* (Opcional para execução local) PostgreSQL rodando localmente (ou use o container do Docker Compose).
* (Opcional) `dotnet-ef` para executar migrations manualmente:

  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

## Estrutura relevante do projeto

* `api/` — projeto ASP.NET (o `api.csproj` tem `TargetFramework` = `net9.0`).
* `api/Dockerfile` — imagem em 2 estágios com `mcr.microsoft.com/dotnet/sdk:9.0` e `aspnet:9.0`.
* `api/docker-compose.yml` — define serviço `postgres` e `api` (com variáveis de ambiente e mapeamento de portas).
* `api/appsettings.json` — string de conexão padrão: `Host=localhost;Database=todo_db;Username=postgres;Password=postgres` e JWT config.
* Endpoints principais:

  * `POST /api/users/register` — registrar usuário.
  * `POST /api/users/login` — autenticar e receber token JWT.
  * `GET/POST/PUT/DELETE /api/tasks` — CRUD de tarefas (autenticado).

---

## Rodando com Docker (recomendado — forma simples)

1. Vá para a pasta que contém o `docker-compose.yml`. No repositório fornecido está em `api/docker-compose.yml`, então:

   ```bash
   cd api
   ```
2. Suba os containers (build + startup):

   ```bash
   docker compose up --build
   ```

   * O `docker-compose.yml` cria dois serviços:

     * `postgres` (Postgres 15) — banco de dados `todo_db`, usuário `postgres`, senha `postgres`.
     * `api` — aplicação ASP.NET em container, exposta na porta **5000** do host (mapeada para `80` no container).
   * Para rodar em background:

     ```bash
     docker compose up --build -d
     ```
3. Logs e migrações:

   * O `Program.cs` aplica `db.Database.Migrate()` na inicialização e inclui retry/exponential backoff; portanto, a API tentará criar/migrar o banco automaticamente ao subir.
   * Se der erro de conexão no primeiro momento (Postgres ainda inicializando), o serviço tenta novamente conforme a estratégia de retry.

**Acessar a API:** `http://localhost:5000`

---

## Rodando 100% local (sem Docker)

1. Certifique-se de ter:

   * .NET 9 SDK instalado.
   * PostgreSQL rodando localmente (host `localhost`, porta `5432`) ou ajuste `appsettings.json`/variáveis de ambiente conforme preferir.
2. Configurar string de conexão (opcional):

   * Por padrão o projeto usa `appsettings.json`:

     ```json
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=todo_db;Username=postgres;Password=postgres"
     }
     ```
   * Você pode sobrescrever pela variável de ambiente:

     ```bash
     export ConnectionStrings__DefaultConnection="Host=localhost;Database=todo_db;Username=postgres;Password=postgres"
     ```

     (Windows PowerShell: `setx ConnectionStrings__DefaultConnection "..."` ou use `dotnet user-secrets` se preferir)
3. Restaurar e rodar:

   ```bash
   cd api
   dotnet restore
   dotnet build
   dotnet run --urls "http://localhost:5000"
   ```

   * A aplicação tentará aplicar migrations automaticamente (igual ao comportamento no container).
4. (Opcional) Aplicar migrations manualmente:

   * Caso precise criar migrations ou aplicar manualmente:

     ```bash
     # caso ainda não tenha o dotnet-ef tool
     dotnet tool install --global dotnet-ef

     # dentro da pasta api/
     dotnet ef database update
     ```
   * Para criar uma migration (se necessário):

     ```bash
     dotnet ef migrations add InitialCreate
     dotnet ef database update
     ```

---

## Documentação no Swagger '/docs'

Depois de rodar a API, acesse `http://localhost:5000/docs` para ver a documentação e testar pelo Swagger, de acordo com sua preferencia.

## Variáveis de ambiente importantes

Você pode sobrescrever essas variáveis (ex.: `docker-compose` já define elas para o container `api`):

* `ConnectionStrings__DefaultConnection` — string de conexão PostgreSQL.
* `Jwt__Key` — chave secreta para JWT (pode ser base64). (no repo: `"6Mf9BP...f4="`)
* `Jwt__Issuer` — issuer do token (ex.: `todo_api`).
* `Jwt__Audience` — audience do token (ex.: `todo_api_users`).
* `ASPNETCORE_URLS` — se quiser alterar a URL e porta (ex.: `http://+:80` no container).

---

## Como testar 🔎

### Swagger

Acesse `http://localhost:5000/docs` e teste!

### CURLs

1. **Registrar usuário**

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"meuuser","password":"senha123"}'
```

2. **Login (recebe token)**

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"meuuser","password":"senha123"}'
```

Resposta esperada:

```json
{ "token": "<JWT_TOKEN_AQUI>" }
```

3. **Criar task (autenticado)**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN_AQUI>" \
  -d '{
    "title": "Buy milk",
    "description": "2 liters, whole milk",
    "category": "personal",
    "isCompleted": false
  }'
```

Resposta: `201 Created` com o objeto `TaskReadDto` (id, title, createdAt, etc).

4. **Obter tarefas do usuário logado**

```bash
curl -H "Authorization: Bearer <JWT_TOKEN_AQUI>" http://localhost:5000/api/tasks
```

---

## Observações importantes / Troubleshooting

* **Erro de validação `User is required`**: se você ainda usa o *entity* `TaskItem` diretamente no corpo da requisição, a model validation pode exigir a propriedade `User`/`UserId`. Solução correta já aplicada no projeto: usar **DTOs** (TaskCreateDto / TaskUpdateDto / TaskReadDto) e um **TasksService** que define `UserId` a partir do usuário autenticado antes de salvar. ✅
* **Porta/URL diferente no `dotnet run`**: por padrão `dotnet run` pode abrir em outra porta/https; para garantir a porta 5000 utilize `--urls "http://localhost:5000"`.
* **Postgres não acessível no Docker Compose**: se o container `api` tentar migrar antes do Postgres estar pronto, o `Program.cs` já possui retry/exponential backoff — aguarde alguns segundos e verifique logs. Se persistir, verifique se o `docker-compose` usou a network correta e se o `postgres` está saudável.
* **Migrações**: o app tenta rodar `Database.Migrate()` automaticamente. Se preferir controlar manualmente, use `dotnet ef database update` localmente ou ajuste o fluxo no `Program.cs`.
* **JWT**: mantenha a chave segura em produção; o projeto aceita chave em base64 ou em texto plano (Program.cs converte/valida tamanho mínimo de 32 bytes).

---

## Comandos rápidos resumo

* Subir com Docker (pasta `api/`):

  ```bash
  cd api
  docker compose up --build
  ```
* Rodar local (pasta `api/`):

  ```bash
  cd api
  dotnet run --urls "http://localhost:5000"
  ```
* Aplicar migrations manualmente (opcional):

  ```bash
  cd api
  dotnet ef database update
  ```

---

## Endpoints principais (resumo)

* `POST /api/users/register` — body: `{ "username": "...", "password": "..." }`
* `POST /api/users/login` — body: `{ "username": "...", "password": "..." }` → retorna `{ "token": "..." }`
* `GET /api/tasks` — Authorization: Bearer `<token>`
* `POST /api/tasks` — Authorization: Bearer `<token>`, body: `TaskCreateDto`
* `GET/PUT/DELETE /api/tasks/{id}` — Authorization: Bearer `<token>`

---

## Notas finais

* Projeto direcionado para **.NET 9 (net9.0)** — verifique seu SDK: `dotnet --version` deve reportar versão compatível.
* Docker Compose no repositório define `ConnectionStrings__DefaultConnection` apontando para o serviço `postgres` do compose, por isso é a forma mais simples de rodar sem configurar nada localmente. 🐳

---

## Referências

* ASP.NET Core and Docker — Microsoft Docs: [https://learn.microsoft.com/aspnet/core/containers/docker](https://learn.microsoft.com/aspnet/core/containers/docker)
* EF Core Migrations — Microsoft Docs: [https://learn.microsoft.com/ef/core/managing-schemas/migrations/](https://learn.microsoft.com/ef/core/managing-schemas/migrations/)
* Model binding & validation in ASP.NET Core — Microsoft Docs: [https://learn.microsoft.com/aspnet/core/mvc/models/validation](https://learn.microsoft.com/aspnet/core/mvc/models/validation)

---
