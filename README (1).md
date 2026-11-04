# Nome do Projeto

Breve descrição do que o projeto faz e qual problema ele resolve.

## Tecnologias

- Node.js
- (Next.js / React / Vite / outras — ajuste conforme seu projeto)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm, yarn ou pnpm

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

# Instale as dependências
npm install
```

## Configuração das variáveis de ambiente

Este projeto usa um arquivo `.env.local` para guardar informações sensíveis.
Ele **não é versionado** (está no `.gitignore`).

1. Crie o arquivo `.env.local` na raiz do projeto:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha os valores:

   ```env
   # Exemplo
   DATABASE_URL=
   API_KEY=
   NEXT_PUBLIC_API_URL=
   ```

> Nunca faça commit de chaves, senhas ou tokens.

## Como executar

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar build de produção
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Estrutura do projeto

```
.
├── src/            # Código-fonte
├── public/         # Arquivos estáticos
├── .env.local      # Variáveis locais (não versionado)
├── .gitignore
└── README.md
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit: `git commit -m "Adiciona minha feature"`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
