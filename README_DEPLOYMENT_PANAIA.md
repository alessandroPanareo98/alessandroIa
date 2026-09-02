# PANAIA — Guida pubblicazione e aggiornamenti server

Questa guida descrive il flusso standard per pubblicare PANAIA sul VPS e aggiornare l'applicazione in sicurezza.

## 1. Architettura

Produzione:

```text
Internet
   │
   ▼
Nginx :80/:443
   │
   ├── Frontend Angular
   │
   └── /api → Backend Spring Boot :8080
                    │
                    ├── PostgreSQL :5432
                    │
                    └── Ollama :11434
```

I servizi devono comunicare tramite la rete Docker interna.

**Non esporre pubblicamente PostgreSQL e Ollama.**

---

# 2. Requisiti del server

Sul VPS installare:

- Docker
- Docker Compose
- Git

Verificare:

```bash
docker --version
docker compose version
git --version
```

---

# 3. Primo deploy

Clonare il repository:

```bash
git clone https://github.com/alessandroPanareo98/alessandroIa.git
cd alessandroIa
```

Creare il file `.env`:

```bash
nano .env
```

Esempio:

```env
POSTGRES_PASSWORD=CAMBIA_QUESTA_PASSWORD
JWT_SECRET=INSERISCI_UN_SECRET_LUNGO
GITLAB_TOKEN=
GITLAB_WEBHOOK_TOKEN=CAMBIA_QUESTO_TOKEN
```

**IMPORTANTE:** `.env` non deve essere pubblicato su GitHub.

Avviare i container:

```bash
docker compose up -d --build
```

Controllare:

```bash
docker compose ps
```

Visualizzare i log:

```bash
docker compose logs -f
```

---

# 4. Installazione del modello Ollama

Dopo il primo avvio:

```bash
docker compose exec ollama ollama pull llama3.2
```

Verificare:

```bash
docker compose exec ollama ollama list
```

Test:

```bash
docker compose exec ollama ollama run llama3.2 "Ciao PANAIA"
```

Il modello viene salvato nel volume Docker `ollama-data`.

---

# 5. Aggiornamento standard di PANAIA

Quando viene pubblicato un nuovo aggiornamento sul repository:

```bash
cd /percorso/alessandroIa
```

Scaricare le modifiche:

```bash
git pull origin main
```

Ricostruire e riavviare:

```bash
docker compose up -d --build
```

Controllare lo stato:

```bash
docker compose ps
```

Controllare il backend:

```bash
docker compose logs --tail=100 backend
```

Controllare il frontend:

```bash
docker compose logs --tail=100 frontend
```

---

# 6. Aggiornamento solo frontend

Se è cambiato solo Angular:

```bash
git pull origin main
docker compose up -d --build frontend
```

---

# 7. Aggiornamento solo backend

Se è cambiato solo Spring Boot:

```bash
git pull origin main
docker compose up -d --build backend
```

---

# 8. Modifiche al database / Flyway

Le modifiche al database devono essere gestite con nuove migration Flyway.

**NON modificare una migration già eseguita in produzione.**

Esempio:

```text
V1__init_schema.sql
V2__create_ai_settings.sql
V3__create_community_rules.sql
V4__...
```

Dopo aver pubblicato una nuova migration:

```bash
git pull origin main
docker compose up -d --build backend
```

Spring Boot/Flyway eseguirà automaticamente le migration mancanti all'avvio del backend.

Controllare i log:

```bash
docker compose logs -f backend
```

Cercare messaggi relativi a:

```text
Flyway
Successfully applied
Migration
```

---

# 9. Controllo database

Entrare in PostgreSQL:

```bash
docker compose exec postgres psql -U postgres -d aidevops_dev
```

Controllare le tabelle:

```sql
\dt
```

Controllare Flyway:

```sql
SELECT installed_rank, version, description, success
FROM flyway_schema_history
ORDER BY installed_rank;
```

Uscire:

```sql
\q
```

---

# 10. Controllo applicazione

Controllare i container:

```bash
docker compose ps
```

Controllare il backend:

```bash
docker compose logs --tail=200 backend
```

Controllare Ollama:

```bash
docker compose logs --tail=100 ollama
```

Testare il backend dal server:

```bash
curl http://localhost:8080/actuator/health
```

Se l'endpoint health è disponibile, dovrebbe restituire uno stato di salute dell'applicazione.

---

# 11. Riavvio dei servizi

Riavvio completo:

```bash
docker compose restart
```

Solo backend:

```bash
docker compose restart backend
```

Solo frontend:

```bash
docker compose restart frontend
```

Solo Ollama:

```bash
docker compose restart ollama
```

---

# 12. Ricostruzione completa

Se ci sono problemi dopo un aggiornamento:

```bash
docker compose down
docker compose up -d --build
```

**ATTENZIONE:** `docker compose down` non elimina normalmente i volumi.

NON usare:

```bash
docker compose down -v
```

in produzione senza sapere esattamente cosa si sta facendo.

Il parametro `-v` può eliminare i volumi, compresi i dati PostgreSQL e il modello Ollama.

---

# 13. Pulizia immagini Docker

Controllare lo spazio:

```bash
docker system df
```

Pulizia prudente:

```bash
docker image prune
```

Pulizia più aggressiva:

```bash
docker system prune
```

Prima di eseguire comandi di pulizia in produzione verificare cosa verrà eliminato.

---

# 14. Backup PostgreSQL

Creare un backup:

```bash
docker compose exec -T postgres \
  pg_dump -U postgres -d aidevops_dev \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

Esempio:

```text
backup_20260902_150000.sql
```

Il backup deve essere conservato anche fuori dal VPS.

---

# 15. Ripristino PostgreSQL

Per ripristinare un backup:

```bash
cat backup.sql | docker compose exec -T postgres \
  psql -U postgres -d aidevops_dev
```

Prima di un ripristino in produzione verificare sempre il backup e lo stato del database.

---

# 16. Aggiornamento sicuro consigliato

Per ogni release usare questo flusso:

```bash
cd /percorso/alessandroIa

git status

git pull origin main

docker compose build

docker compose up -d

docker compose ps

docker compose logs --tail=100 backend
```

Poi verificare dal browser:

```text
http://IP_DEL_SERVER
```

oppure, quando configurato il dominio:

```text
https://panaia.it
```

---

# 17. Rollback

Prima di aggiornamenti importanti è consigliato conoscere il commit attualmente in produzione:

```bash
git rev-parse HEAD
```

Se una versione causa problemi:

```bash
git log --oneline -10
```

Individuare il commit precedente:

```bash
git checkout <COMMIT_PRECEDENTE>
```

Ricostruire:

```bash
docker compose up -d --build
```

Dopo aver verificato il problema, tornare al branch principale:

```bash
git checkout main
git pull origin main
```

## ATTENZIONE AL DATABASE

Un rollback del codice **non equivale automaticamente a un rollback del database**.

Se una nuova versione ha eseguito una migration Flyway, non cancellare o modificare manualmente la cronologia Flyway.

Per modifiche database importanti usare una migration successiva o una procedura di rollback specifica.

---

# 18. Git workflow consigliato

Sviluppo locale:

```bash
git status
git add .
git commit -m "feat: descrizione modifica"
git push origin main
```

Sul server:

```bash
git pull origin main
docker compose up -d --build
```

Per modifiche importanti è preferibile usare release/tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

In futuro si può automatizzare il deploy con CI/CD.

---

# 19. Variabili e segreti

Non inserire mai nel repository:

- password PostgreSQL reali
- JWT secret reali
- token GitLab
- credenziali
- chiavi API
- certificati privati

Il file `.env` deve rimanere sul server.

Nel repository mantenere eventualmente:

```text
.env.example
```

con valori fittizi:

```env
POSTGRES_PASSWORD=change-me
JWT_SECRET=change-me
GITLAB_TOKEN=
GITLAB_WEBHOOK_TOKEN=change-me
```

---

# 20. Porte

Configurazione consigliata:

| Servizio | Porta interna | Pubblica |
|---|---:|---:|
| Nginx / Frontend | 80 | 80 |
| HTTPS | 443 | 443 |
| Backend | 8080 | Preferibilmente NO |
| PostgreSQL | 5432 | NO |
| Ollama | 11434 | NO |

In produzione il browser dovrebbe parlare con:

```text
https://panaia.it/api/...
```

e Nginx inoltrerà le richieste al backend Docker.

---

# 21. Configurazione dominio

Quando il dominio è pronto:

```text
panaia.it
     │
     ▼
IP VPS
     │
     ▼
Nginx
 ┌───┴────┐
 ▼        ▼
Angular  /api → Spring Boot
```

Il certificato HTTPS deve essere configurato tramite Let's Encrypt/Certbot o tramite una soluzione equivalente.

Dopo la configurazione, verificare:

```text
https://panaia.it
```

e:

```text
https://panaia.it/api/...
```

---

# 22. Checklist prima di ogni deploy

- [ ] `git status` controllato
- [ ] codice compilato localmente
- [ ] test eseguiti
- [ ] migration Flyway verificate
- [ ] backup DB eseguito se necessario
- [ ] `.env` non modificato accidentalmente
- [ ] `git pull` eseguito sul server
- [ ] immagini Docker ricostruite
- [ ] container `Up`
- [ ] backend senza errori
- [ ] frontend raggiungibile
- [ ] login/chat verificati
- [ ] Ollama e modello disponibili

---

# 23. Comandi rapidi

### Stato

```bash
docker compose ps
```

### Log backend

```bash
docker compose logs -f backend
```

### Log frontend

```bash
docker compose logs -f frontend
```

### Log Ollama

```bash
docker compose logs -f ollama
```

### Riavvio

```bash
docker compose restart
```

### Aggiornamento completo

```bash
git pull origin main
docker compose up -d --build
docker compose ps
```

### Aggiornamento backend

```bash
git pull origin main
docker compose up -d --build backend
```

### Aggiornamento frontend

```bash
git pull origin main
docker compose up -d --build frontend
```

### Modelli Ollama

```bash
docker compose exec ollama ollama list
```

### Backup DB

```bash
docker compose exec -T postgres \
  pg_dump -U postgres -d aidevops_dev \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

# 24. Obiettivo futuro: deploy automatico

Il flusso manuale attuale è:

```text
Sviluppo
   ↓
Git commit
   ↓
Git push
   ↓
VPS
   ↓
git pull
   ↓
docker compose up -d --build
```

In futuro può essere trasformato in:

```text
Developer
   ↓
Git push
   ↓
GitHub Actions
   ↓
Build + Test
   ↓
Docker Image
   ↓
Deploy VPS
   ↓
PANAIA aggiornata
```

Questo permetterà di pubblicare gli aggiornamenti senza entrare manualmente nel server ogni volta.
