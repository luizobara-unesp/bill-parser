# Bill Parser

Este projeto é uma aplicação full-stack desenvolvida para analisar e extrair informações de documentos de contas (boletos/faturas). Ele utiliza uma arquitetura de microsserviços para separar as responsabilidades e permitir o desenvolvimento e escalabilidade independentes de seus componentes.

## Arquitetura

A aplicação é composta por três serviços principais:

- **Frontend:** Uma aplicação web Next.js que fornece a interface de usuário para fazer upload de contas e visualizar os dados extraídos.
- **Backend:** Uma aplicação Spring Boot que atua como a API principal, lidando com a lógica de negócios, autenticação de usuário e persistência de dados.
- **Extractor Service:** Um serviço Python responsável por extrair dados dos documentos de contas usando inteligência artificial.

Os serviços são conteinerizados usando Docker e orquestrados com Docker Compose.

## Tecnologias

- **Frontend:**
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS

- **Backend:**
  - Java 17
  - Spring Boot
  - Spring Security (JWT)
  - PostgreSQL
  - OpenFeign

- **Extractor Service:**
  - Python
  - FastAPI
  - Groq (Cliente LLM)
  - Bibliotecas de processamento de PDF

## Primeiros Passos

Para executar a aplicação, você precisará ter o Docker e o Docker Compose instalados.

1. Clone o repositório:
   ```bash
   git clone https://github.com/luizobara-unesp/bill-parser.git
   ```

2. Navegue até o diretório raiz do projeto:
   ```bash
   cd bill-parser
   ```

3. Crie um arquivo `.env` no diretório `extrator-service` copiando o arquivo de exemplo:
   ```bash
   cp extrator-service/.env.example extrator-service/.env
   ```
   Você precisará adicionar sua chave de API do Groq a este arquivo.

4. Inicie a aplicação usando Docker Compose:
   ```bash
   docker-compose up -d
   ```

O frontend estará disponível em `http://localhost:3000`.

## Serviços

### Frontend

O frontend é uma aplicação Next.js que permite aos usuários:

- Registrar e fazer login
- Fazer upload de documentos de contas (PDFs)
- Visualizar uma lista de suas contas
- Ver os dados extraídos de cada conta

### Backend

O backend é uma aplicação Spring Boot que fornece uma API REST para o frontend. Suas principais responsabilidades incluem:

- Autenticação e autorização de usuários
- Armazenar e recuperar informações de contas do banco de dados PostgreSQL
- Chamar o Extractor Service para processar novas contas

### Extractor Service

O Extractor Service é uma aplicação Python construída com FastAPI. Ele expõe um endpoint que recebe um documento de conta, o processa usando um Large Language Model (LLM) através da API do Groq e retorna os dados extraídos em um formato estruturado.
