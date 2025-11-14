
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
  "valor_total_pagar": 17694.26,
  "data_vencimento": "13/08/2025",
  "mes_referencia_geral": "JUN/2025",
  "consumo_ponta_kwh": 2568.96,
  "consumo_fora_ponta_kwh": 23451.3,
  "dias_faturamento": 30,
  "avisos_importantes": [
    "ATRASO NO PAGAMENTO SERÁ COBRADO EM CONTA FUTURA: MULTA 2%, JUROS MORA 0,033% AO DIA E CORREÇÃO MONETÁRIA, CONF.LEGISLAÇÃO VIGENTE"
  ],
  "bandeira_tarifaria": "Vermelha P1",
  "itens_faturados": [
    {
      "descricao": "Consumo Ponta [KWh] - TUSD",
      "mes_referencia": "JUN/25",
      "quantidade": 2568.96,
      "valor_total": 2655.9
    },
    {
      "descricao": "Consumo Fora Ponta [KWh]-TUSD",
      "mes_referencia": "JUN/25",
      "quantidade": 23451.3,
      "valor_total": 2361.87
    },
    {
      "descricao": "Cons Ponta - TE",
      "mes_referencia": "JUN/25",
      "quantidade": 2568.96,
      "valor_total": 1353.57
    },
    {
      "descricao": "Cons FPonta TE",
      "mes_referencia": "JUN/25",
      "quantidade": 23451.3,
      "valor_total": 7660.37
    },
    {
      "descricao": "Adicional Band Vermelha Ponta",
      "mes_referencia": "JUN/25",
      "quantidade": null,
      "valor_total": 120.34
    },
    {
      "descricao": "Adicional Band Vermelha FPonta",
      "mes_referencia": "JUN/25",
      "quantidade": null,
      "valor_total": 1098.6
    },
    {
      "descricao": "Demanda [kW] - TUSD",
      "mes_referencia": "JUN/25",
      "quantidade": 88.32,
      "valor_total": 1182.91
    },
    {
      "descricao": "Demanda [kW] - TUSD",
      "mes_referencia": "JUN/25",
      "quantidade": 117.68,
      "valor_total": 1576.15
    }
  ],
  "tributos_detalhados": [
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 22.58
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 103.05
    },
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 20.08
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 91.64
    },
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 11.51
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 52.52
    },
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 65.11
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 297.22
    },
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 1.02
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 4.67
    },
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 9.34
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 42.63
    },
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 10.05
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 45.9
    },
    {
      "nome": "PIS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 13.4
    },
    {
      "nome": "COFINS",
      "base_calculo": null,
      "aliquota": null,
      "valor": 61.15
    }
  ],
  "demanda_contratada": {
    "tipo": "Única",
    "valor_kw": 206
  },
  "datas_leitura": {
    "leitura_anterior": "31/05/2025",
    "leitura_atual": "30/06/2025",
    "qtd_dias": 30,
    "proxima_leitura_prevista": "31/07/2025"
  },
  "tarifas_aneel": [
    {
      "descricao": "Ponta TE",
      "valor": 0.50197
    },
    {
      "descricao": "Fponta TE",
      "valor": 0.3112
    },
    {
      "descricao": "Ponta TUSD",
      "valor": 0.98494
    },
    {
      "descricao": "FPonta TUSD",
      "valor": 0.09595
    }
  ],
  "equipamentos_medicao": {
    "energia_ativa": "40191831",
    "energia_reativa": "40191831",
    "taxa_perda_percent": 0
  },
  "demonstrativo_utilizacao": {
    "consumo_ponta": [
      {
        "mes_referencia": "2025 JUN",
        "consumo_kwh": 2568,
        "dias": 30
      },
      {
        "mes_referencia": "2025 MAI",
        "consumo_kwh": 3081,
        "dias": 31
      },
      {
        "mes_referencia": "2025 ABR",
        "consumo_kwh": 3375,
        "dias": 30
      },
      {
        "mes_referencia": "2025 MAR",
        "consumo_kwh": 3978,
        "dias": 31
      },
      {
        "mes_referencia": "2025 FEV",
        "consumo_kwh": 3058,
        "dias": 28
      },
      {
        "mes_referencia": "2025 JAN",
        "consumo_kwh": 2463,
        "dias": 31
      },
      {
        "mes_referencia": "2024 DEZ",
        "consumo_kwh": 2325,
        "dias": 31
      },
      {
        "mes_referencia": "2024 NOV",
        "consumo_kwh": 2889,
        "dias": 30
      },
      {
        "mes_referencia": "2024 OUT",
        "consumo_kwh": 3665,
        "dias": 31
      },
      {
        "mes_referencia": "2024 SET",
        "consumo_kwh": 3472,
        "dias": 30
      },
      {
        "mes_referencia": "2024 AGO",
        "consumo_kwh": 2785,
        "dias": 31
      },
      {
        "mes_referencia": "2024 JUL",
        "consumo_kwh": 0,
        "dias": 31
      }
    ],
    "consumo_fora_ponta": [
      {
        "mes_referencia": "2025 JUN",
        "consumo_kwh": 23451,
        "dias": 30
      },
      {
        "mes_referencia": "2025 MAI",
        "consumo_kwh": 28300,
        "dias": 31
      },
      {
        "mes_referencia": "2025 ABR",
        "consumo_kwh": 32446,
        "dias": 30
      },
      {
        "mes_referencia": "2025 MAR",
        "consumo_kwh": 40708,
        "dias": 31
      },
      {
        "mes_referencia": "2025 FEV",
        "consumo_kwh": 36337,
        "dias": 28
      },
      {
        "mes_referencia": "2025 JAN",
        "consumo_kwh": 28526,
        "dias": 31
      },
      {
        "mes_referencia": "2024 DEZ",
        "consumo_kwh": 24896,
        "dias": 31
      },
      {
        "mes_referencia": "2024 NOV",
        "consumo_kwh": 29981,
        "dias": 30
      },
      {
        "mes_referencia": "2024 OUT",
        "consumo_kwh": 32352,
        "dias": 31
      },
      {
        "mes_referencia": "2024 SET",
        "consumo_kwh": 32377,
        "dias": 30
      },
      {
        "mes_referencia": "2024 AGO",
        "consumo_kwh": 24538,
        "dias": 31
      },
      {
        "mes_referencia": "2024 JUL",
        "consumo_kwh": 0,
        "dias": 31
      }
    ],
    "demanda": [
      {
        "mes_referencia": "2025 JUN",
        "demanda_kw": 88,
        "dias": 30
      },
      {
        "mes_referencia": "2025 MAI",
        "demanda_kw": 143,
        "dias": 31
      },
      {
        "mes_referencia": "2025 ABR",
        "demanda_kw": 190,
        "dias": 30
      },
      {
        "mes_referencia": "2025 MAR",
        "demanda_kw": 205,
        "dias": 31
      },
      {
        "mes_referencia": "2025 FEV",
        "demanda_kw": 201,
        "dias": 28
      },
      {
        "mes_referencia": "2025 JAN",
        "demanda_kw": 134,
        "dias": 31
      },
      {
        "mes_referencia": "2024 DEZ",
        "demanda_kw": 158,
        "dias": 31
      },
      {
        "mes_referencia": "2024 NOV",
        "demanda_kw": 196,
        "dias": 30
      },
      {
        "mes_referencia": "2024 OUT",
        "demanda_kw": 178,
        "dias": 31
      },
      {
        "mes_referencia": "2024 SET",
        "demanda_kw": 196,
        "dias": 30
      },
      {
        "mes_referencia": "2024 AGO",
        "demanda_kw": 140,
        "dias": 31
      },
      {
        "mes_referencia": "2024 JUL",
        "demanda_kw": 0,
        "dias": 31
      }
    ]
  },
  "dados_leitura_medidor": [
    {
      "descricao": "kWh Ponta",
      "atual": "173085",
      "anterior": "171801",
      "fator_multiplicacao": 2
    },
    {
      "descricao": "kWh F.Ponta",
      "atual": "672303",
      "anterior": "660578",
      "fator_multiplicacao": 2
    },
    {
      "descricao": "kW Ponta",
      "atual": "000307",
      "anterior": "000388",
      "fator_multiplicacao": 0.2
    },
    {
      "descricao": "kW F.Ponta",
      "atual": "000441",
      "anterior": "000717",
      "fator_multiplicacao": 0.2
    },
    {
      "descricao": "Ufer Ponta",
      "atual": "000094",
      "anterior": "000094",
      "fator_multiplicacao": 2
    },
    {
      "descricao": "Ufer F.Ponta",
      "atual": "003762",
      "anterior": "003762",
      "fator_multiplicacao": 2
    }
  ],
  "niveis_tensao": {
    "contratado": "23.100",
    "minimo": "21.483",
    "maximo": "24.255"
  },
  "indicadores_continuidade": [
    {
      "descricao": "Padrão Mensal",
      "dic": 5,
      "fic": 3,
      "dmic": 5,
      "dicri": 8
    },
    {
      "descricao": "Apurado Mensal",
      "dic": 0,
      "fic": 0,
      "dmic": 0,
      "dicri": 0
    }
  ],
  "dados_cliente": "DADOS_OCULTADOS"
}
```