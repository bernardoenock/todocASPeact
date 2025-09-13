# Full Stack TODO List

🚀 **Full Stack TODO List** é um projeto completo para gerenciar tarefas (tasks) com **ASP.NET Core Web API** no backend e **React + TypeScript** no frontend.
O projeto inclui autenticação de usuários, CRUD de tarefas, filtros por categoria e integração entre frontend e backend.

O repositório está organizado em duas pastas principais:

```
/api    -> Backend (ASP.NET Core Web API + PostgreSQL)
/client -> Frontend (React + TypeScript + TailwindCSS)
```

---

## 🔹 Backend — ASP.NET Core Web API

Um projeto **ASP.NET Core 9 (net9.0)** com:

* Entity Framework Core + PostgreSQL
* Modelos de dados:

  * **User**: `Id`, `Username`, `PasswordHash`, `CreatedAt`
  * **TaskItem**: `Id`, `Title`, `Description`, `IsCompleted`, `Category`, `CreatedAt`, `UpdatedAt`, `UserId` (FK)
* Endpoints para CRUD de tarefas, incluindo filtros por categoria e usuário
* Endpoints para registro e login de usuários com JWT
* Validações de modelos e dados nos endpoints

### 📖 Documentação do Backend

O backend possui seu próprio README detalhado em [`api/README.md`](api/README.md).
**Recomenda-se seguir esse guia para subir a API.**

**Acesso direto aos endpoints:**

* Registrar usuário: `POST /api/users/register`
* Login: `POST /api/users/login` → retorna token JWT
* CRUD de tarefas: `GET/POST/PUT/DELETE /api/tasks` (autenticado)

**Rodando a API:**

* **Com Docker (recomendado):**

```bash
cd api
docker compose up --build
```

* **100% local (sem Docker):**

```bash
cd api
dotnet restore
dotnet build
dotnet run --urls "http://localhost:5000"
```

Após subir a API, acesse a documentação Swagger:

```
http://localhost:5000/docs
```

> Para detalhes completos, migrações, variáveis de ambiente e troubleshooting, veja [`api/README.md`](api/README.md)

---

## 🔹 Frontend — React + TypeScript + TailwindCSS

O frontend foi desenvolvido em **React 18 + TypeScript**, seguindo **Atomic Design** e consumindo a API do backend.

Principais funcionalidades:

* Listar, criar, editar e deletar tarefas
* Filtragem por categoria
* Autenticação de usuários (registro e login)
* Modo demo (usando **localStorage**) para testar sem API
* Validações no frontend com **React Hook Form + Yup**
* Estilização com **TailwindCSS**

### 📖 Documentação do Frontend

O frontend possui README detalhado em [`client/README.md`](client/README.md).
Você também pode acessar a aplicação hospedada via GitHub Pages:

[https://bernardoenock.github.io/todocASPeact/](https://bernardoenock.github.io/todocASPeact/)

**Rodando localmente:**

```bash
cd client
npm install
npm run dev
```

Acesse no navegador:

```
http://localhost:5173/
```

---

## 🔗 Conexão Frontend <-> Backend

Por padrão, o frontend consome a API em:

```
http://localhost:5000/
```

Para ativar a API, siga as instruções do backend (`api/README.md`).
Caso queira apenas testar o frontend sem backend, ative o **Modo Demo** na aplicação.

---

## 🗂 Estrutura do Repositório

```
root/
 ├── api/      # Backend ASP.NET Core + EF Core + PostgreSQL
 ├── client/   # Frontend React + TypeScript + Tailwind
```

---

## ✅ Requisitos

* **Backend**

  * .NET 9 SDK (para execução local)
  * Docker & Docker Compose (opcional, recomendado)
  * PostgreSQL (opcional, se não usar Docker)

* **Frontend**

  * Node.js 18+
  * npm ou yarn
  * Docker Compose (opcional)

---

## 🛠 Tecnologias utilizadas

* **Backend:** ASP.NET Core 9, EF Core, PostgreSQL, JWT
* **Frontend:** React 18, TypeScript, TailwindCSS, Vite, React Query, React Hook Form + Yup
* **DevOps / Deploy:** Docker, Docker Compose, GitHub Pages (frontend)

---

## 📚 Referências

* ASP.NET Core + Docker: [https://learn.microsoft.com/aspnet/core/containers/docker](https://learn.microsoft.com/aspnet/core/containers/docker)
* EF Core Migrations: [https://learn.microsoft.com/ef/core/managing-schemas/migrations/](https://learn.microsoft.com/ef/core/managing-schemas/migrations/)
* React + TypeScript + Tailwind: [https://reactjs.org/](https://reactjs.org/), [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**💡 Observação:**
Para simplificar o desenvolvimento, recomenda-se subir primeiro o backend via Docker e, em seguida, iniciar o frontend para integração completa.

---
