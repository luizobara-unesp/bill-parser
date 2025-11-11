# --- 1. Estágio de Build ---
# Usamos a imagem do Gradle com JDK 17 para COMPILAR o projeto
FROM gradle:8.5-jdk17-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de build do Gradle
COPY build.gradle settings.gradle ./
# Copia o código-fonte
COPY src ./src

# Executa o build do Spring Boot (bootJar)
# --no-daemon é recomendado para ambientes de CI/Docker
RUN gradle bootJar --no-daemon

# --- 2. Estágio de Produção ---
# Usamos uma imagem JRE (Java Runtime Environment) leve, pois não precisamos mais do JDK/Gradle
FROM openjdk:17-jre-slim

WORKDIR /app

# Copia APENAS o .jar compilado do estágio 'build'
COPY --from=build /app/build/libs/*.jar app.jar

# Expõe a porta 8080 que o Spring usa
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]