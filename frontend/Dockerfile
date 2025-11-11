# --- 1. Estágio de Build ---
# Usamos a imagem Node 18-alpine para COMPILAR o projeto
FROM node:22-slim AS builder
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código-fonte
COPY . .

# Executa o build do Next.js
RUN npm run build

# --- 2. Estágio de Produção ---
# Usamos uma imagem Node 18-alpine leve para RODAR o app
FROM node:18-alpine AS runner
WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV production

# Copia os arquivos de build otimizados do estágio 'builder'
# Isso usa o recurso "standalone" do Next.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar o servidor Next.js
CMD ["node", "server.js"]