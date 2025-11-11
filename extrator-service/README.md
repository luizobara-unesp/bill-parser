
# Extrator de Contas com LLM

Este serviço é uma API RESTful construída com FastAPI que utiliza um Large Language Model (LLM) da Groq para extrair dados estruturados de faturas em formato PDF. Ele é projetado para automatizar a análise e a digitalização de informações contidas em documentos de contas (como contas de energia, água, etc.), transformando texto não estruturado em dados JSON facilmente consumíveis.

## Funcionalidades

*   **Extração de Texto de PDFs:** Capacidade de ler e extrair texto bruto de arquivos PDF.
*   **Análise Inteligente com LLM:** Envia o texto extraído para um LLM (Groq) para identificar e estruturar informações chave.
*   **Validação de Dados:** Utiliza Pydantic para validar a estrutura e o tipo dos dados retornados pelo LLM, garantindo a consistência.
*   **API RESTful:** Interface simples e clara para upload de PDFs e recebimento de dados JSON.
*   **Omissão de PII:** Configurado para omitir informações de identificação pessoal (PII) na saída JSON.

## Tecnologias Utilizadas

*   **Python:** Linguagem de programação principal.
*   **FastAPI:** Framework web moderno e rápido para construir APIs.
*   **Pydantic:** Para validação de dados e gerenciamento de configurações.
*   **pdfplumber:** Biblioteca para extração de texto de PDFs.
*   **Groq:** Provedor de Large Language Model para análise e extração inteligente.
*   **python-dotenv:** Para carregar variáveis de ambiente.

## Estrutura do Projeto

```
extrator-service/
├── .env.example
├── .gitignore
├── README.md
├── app/
│   ├── main.py
│   ├── schemas.py
│   └── services.py
└── .venv/
```

*   `main.py`: Ponto de entrada da aplicação FastAPI, define os endpoints da API.
*   `schemas.py`: Contém os modelos Pydantic que definem a estrutura dos dados esperados na entrada e saída da API.
*   `services.py`: Módulos que encapsulam a lógica de negócio, como extração de texto de PDF e interação com o LLM.
*   `.env.example`: Exemplo de arquivo para configuração de variáveis de ambiente.

## Configuração do Ambiente

1.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`, e preencha com sua chave de API do Groq:

    ```dotenv
    GROQ_API_KEY="sua_chave_api_groq_aqui"
    ```

    Você pode obter uma chave de API Groq em [console.groq.com](https://console.groq.com/).

## Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/luizobara-unesp/extrator-service.git
    cd extrator-service
    ```

2.  **Crie e ative um ambiente virtual (recomendado):**
    ```bash
    python -m venv .venv
    # No Windows
    .venv\Scripts\activate
    # No macOS/Linux
    source .venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```
    *Nota: Você precisará criar o arquivo `requirements.txt` primeiro, se ele não existir, usando `pip freeze > requirements.txt` após instalar as dependências.*

## Como Executar

1.  **Certifique-se de que seu ambiente virtual está ativado.**

2.  **Inicie a aplicação FastAPI:**
    ```bash
    uvicorn app.main:app --reload
    ```
    A API estará disponível em `http://127.0.0.1:8000`.
    A documentação interativa (Swagger UI) estará em `http://127.0.0.1:8000/docs`.

## Uso da API

### Endpoint: `/extract/full-analysis`

*   **Método:** `POST`
*   **Descrição:** Recebe um arquivo PDF de fatura, extrai o texto e retorna uma análise completa em formato JSON.
*   **Parâmetros:**
    *   `file`: O arquivo PDF da fatura (form-data).

**Exemplo (usando `curl`):**

```bash
curl -X POST "http://127.0.0.1:8000/extract/full-analysis" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@/caminho/para/sua/fatura.pdf;type=application/pdf"
```

Substitua `/caminho/para/sua/fatura.pdf` pelo caminho real do seu arquivo PDF.

### Exemplo de Resposta JSON

```json
{
  "valor_total_pagar": 185.85,
  "data_vencimento": "15/11/2025",
  "mes_referencia_geral": "OUT/2025",
  "consumo_total_kwh": 194,
  "dias_faturamento": 30,
  "itens_faturados": [
    {
      "descricao": "Consumo Uso Sistema [KWh]-TUSD",
      "mes_referencia": "OUT/25",
      "quantidade": 194.0,
      "valor_total": 86.11
    },
    {
      "descricao": "Consumo Uso Sistema [KWh]-TE",
      "mes_referencia": "OUT/25",
      "quantidade": 194.0,
      "valor_total": 75.23
    }
  ],
  "tributos_detalhados": [
    {
      "nome": "ICMS",
      "base_calculo": 161.34,
      "aliquota": "25.00%",
      "valor": 40.33
    },
    {
      "nome": "PIS",
      "base_calculo": 161.34,
      "aliquota": "0.93%",
      "valor": 1.50
    }
  ],
  "avisos_importantes": [
    "CDE Escassez Hídrica",
    "Atenção ao consumo consciente."
  ],
  "bandeira_tarifaria": "Verde",
  "dados_cliente": "DADOS_OCULTADOS"
}
```