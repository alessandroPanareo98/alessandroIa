# Backend - AI DevOps Assistant

Backend Spring Boot 3 per ricezione webhook GitLab, gestione pipeline/errori, analisi AI e API REST per dashboard.

## Stack
- Java 21
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Flyway
- OpenAPI/Swagger

## Avvio locale
1. Configura variabili ambiente principali:
   - POSTGRES_USER
   - POSTGRES_PASSWORD
   - DB_URL
   - JWT_SECRET
   - AI_BASE_URL
   - AI_GENERATE_PATH
   - AI_MODEL
   - GITLAB_URL
   - GITLAB_TOKEN
   - GITLAB_WEBHOOK_TOKEN
2. Esegui:
   mvn spring-boot:run

## Endpoint principali
- POST /api/auth/login
- POST /api/auth/register
- GET /api/projects
- GET /api/pipelines
- GET /api/errors
- GET /api/analyses
- GET /api/notifications
- POST /api/webhooks/gitlab

## Swagger
- /swagger-ui.html

## Note architetturali
- Layer Controller -> Service -> Repository
- Integrazione AI via servizio esterno HTTP compatibile OpenAI
- Persistenza con migrazioni Flyway



## INSTALL MODEL 
docker exec -it alessandroia_devcontainer-ollama-1 ollama pull llama3.2

Aspetta che termini il download, poi:

docker exec -it alessandroia_devcontainer-ollama-1 ollama list


TEST 

$ docker exec -it alessandroia_devcontainer-ollama-1 ollama run llama3.2 "Ciao, rispondi con una frase"