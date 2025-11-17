# StockBox - Sistema de Controle de Estoque

Um sistema para controlar itens no estoque: entradas, saídas e quantidade atual.

## Funcionalidades

- **CRUD de Produtos**: Cadastrar, listar, editar e excluir produtos
- **Registro de Movimentações**: Histórico completo de entradas e saídas
- **Alerta de Estoque Baixo**: Notificações automáticas quando quantidade ≤ 5

## Tecnologias

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router 7.9.3
- TanStack Query 5.90.2
- Axios 1.12.2
- Zustand 5.0.8
- React Hook Form 7.63.0
- Zod 4.1.11

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente:
```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── app/              # Configuração da aplicação
├── assets/           # Arquivos estáticos
├── core/             # Componentes e utilitários globais
├── domain/           # Módulos de domínio
└── pages/            # Páginas da aplicação
```

## API

O frontend se conecta ao backend através de:
- `/api/v1/external/*` - Endpoints públicos
- `/api/v1/internal/*` - Endpoints autenticados

## Licença

MIT