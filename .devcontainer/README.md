# Dev Containers

Configurazione Dev Container per avviare backend, frontend e database PostgreSQL.

## Struttura
- backend/devcontainer.json
- frontend/devcontainer.json
- docker-compose.dev.yml
- postgres/init/01-init.sql

## Come usarla
1. Apri il progetto in VS Code.
2. Premi F1 e usa `Dev Containers: Reopen in Container`.
3. Scegli:
   - `AI DevOps Backend` per lavorare sul backend
   - `AI DevOps Frontend` per lavorare sul frontend

## Servizi avviati
- backend-dev (Java 21 + Maven)
- frontend-dev (Node 20)
- postgres (porta 5432)
- pgadmin (porta 5050)
- ollama (porta 11434)

## Comandi utili nel container
- Backend:
  - `cd /workspaces/SoftwareAi/backend`
  - `mvn spring-boot:run`
- Frontend:
  - `cd /workspaces/SoftwareAi/frontend`
  - `npm start`

## Credenziali DB locali
- Host: postgres
- Port: 5432
- Database: aidevops_dev
- User: postgres
- Password: postgres

## PgAdmin
- URL: http://localhost:5050
- Email: admin@aidevops.local
- Password: admin


alessandro.panareo@SIN-NB-1381 MINGW64 ~/Documents/Storage/alessandrobk/alessandroIa (main)
$ docker compose -f .devcontainer/docker-compose.dev.yml config --services
postgres
backend-dev
frontend-dev
ollama
pgadmin

alessandro.panareo@SIN-NB-1381 MINGW64 ~/Documents/Storage/alessandrobk/alessandroIa (main)
$ ^C

alessandro.panareo@SIN-NB-1381 MINGW64 ~/Documents/Storage/alessandrobk/alessandroIa (main)
$ docker compose -f .devcontainer/docker-compose.dev.yml up -d
