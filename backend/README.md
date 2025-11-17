# StockBox Backend API

Backend API for StockBox inventory management system.

## Description

Um sistema para controlar itens no estoque: entradas, saídas e quantidade atual.

## Features

- **CRUD de Produtos**: Cadastrar, listar, editar e excluir produtos diretamente no banco de dados, com informações essenciais como código, descrição e categoria.
- **Registro de Movimentações**: Cada entrada ou saída de estoque fica salva no banco com data, quantidade e referência ao produto, criando automaticamente um histórico completo de movimentações.
- **Alerta de Estoque Baixo**: O sistema verifica automaticamente no banco quando a quantidade de um produto fica menor ou igual a cinco e marca esse item como crítico.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Microsoft SQL Server
- **Validation**: Zod

## Project Structure

```
src/
├── api/                    # API Controllers
│   └── v1/                 # API Version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic services
├── utils/                  # Utility functions
├── constants/              # Application constants
├── instances/              # Service instances
├── tests/                  # Global test utilities
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Microsoft SQL Server
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure database connection in `.env`

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

### Building for Production

```bash
npm run build
npm start
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## API Documentation

### Health Check

```
GET /health
```

Returns the health status of the API.

### API Versioning

All API endpoints are versioned and follow the pattern:
```
/api/v1/external/...  # Public endpoints
/api/v1/internal/...  # Authenticated endpoints
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

ISC