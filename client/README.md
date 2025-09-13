# TODO List Client

Este é o **Front End** do projeto **TODO List**, desenvolvido em **React + TypeScript** com **TailwindCSS**, seguindo o padrão de componentes **Atomic Design**.
A aplicação consome a API disponível em `http://localhost:5000/`, mas também possui um **modo demo** para testar sem precisar subir a API.

---

## ⚙️ Tecnologias utilizadas

* ⚛️ **React 18** + **TypeScript**
* 🎨 **TailwindCSS**
* 📦 **Vite** (build e dev server)
* 🔗 **React Router DOM**
* ✅ **React Hook Form + Yup** (validação de formulários)
* 🔄 **React Query** (gerenciamento de dados assíncronos)
* 🔧 **ESLint + Prettier** (padrões de código e formatação)
* 🧩 **Atomic Design** (organização de componentes)

---

## 🚀 Como executar o projeto

Você pode rodar o Front End de **duas formas**:

### 🔹 1. Usando Docker (recomendado)

Na raiz do projeto, execute:

```bash
docker compose -f client/docker-compose.yml up --build
```

Isso irá:

* Instalar dependências
* Subir o container com a aplicação
* Disponibilizar o projeto no navegador em `http://localhost:5173/`

---

### 🔹 2. Rodando localmente sem Docker

Certifique-se de ter o **Node.js 18+** instalado.

1. Acesse a pasta do client:

   ```bash
   cd client
   ```
2. Instale as dependências:

   ```bash
   npm install
   ```
3. Rode o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```
4. Acesse no navegador:

   ```
   http://localhost:5173/
   ```

---

## 🌐 Conexão com a API

Por padrão, o projeto consome a API em:

```
http://localhost:5000/
```

* Para ativar a API, vá até a pasta `api/` e siga as instruções do arquivo [`api/README.md`](../api/README.md).
* Caso não queira subir a API, clique no botão **"Modo Demo"** na aplicação. Ele habilita um modo de demonstração para usar o Front sem precisar da API.

---

## 📂 Estrutura do projeto (Atomic Design)

A organização segue o padrão **Atomic Design**:

```
src/
 ├── assets/         # Imagens, ícones e estáticos
 ├── components/     # Componentes reutilizáveis
 │    ├── atoms/     # Elementos básicos (botões, inputs, labels)
 │    ├── molecules/ # Combinações de atoms (form groups, cards)
 │    ├── organisms/ # Combinações complexas (listas, headers)
 │    └── templates/ # Estrutura de páginas
 ├── pages/          # Páginas da aplicação
 ├── hooks/          # Hooks customizados
 ├── api/       # Requisições HTTP (axios)
 ├── types/          # Definições de tipos (TypeScript)
 ├── utils/          # Funções utilitárias
 └── main.tsx        # Entrada principal
```

---
