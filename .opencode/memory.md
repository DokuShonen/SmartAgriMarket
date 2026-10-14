# SmartAgriMarket V2 — Contexte mémoire

## Tech stack
- Frontend : Angular 18 (standalone, lazy loading, npx ng serve --poll=2000)
- Backend : Spring Boot 3.4.0 (Java 21, Maven)
- Base : H2 (dev, profil=dev) / PostgreSQL (prod, via docker-compose)
- Auth : JWT (Bearer, localStorage)

## Commandes de lancement
```bash
# Backend (depuis /home/suzuya/Documents/Projets/SmartAgriMarket/backend)
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend (depuis /home/suzuya/Documents/Projets/SmartAgriMarket/frontend)
npx ng serve --poll=2000
```

## IMPORTANT : Java
- Lombok 1.18.36 ne supporte PAS Java 25+
- Toujours utiliser `JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64`
- Java 25 est installé sur la machine mais ne compile pas avec Lombok

## IMPORTANT : Frontend
- Les watchers inotify sont limités (65536), donc `--poll=2000` obligatoire pour `ng serve`
- `npx` est nécessaire pour utiliser la bonne version d'Angular CLI (locale)
- `npm audit` signale 52 vulnérabilités (toutes dans webpack-dev-server / webpack, build-time, non exploitables en runtime) — désactivé via `audit=false` dans `.npmrc`

## Comptes de démo (seed automatique)
| Rôle | Email | Mot de passe |
|------|-------|-------------|
| ADMIN | admin@smartagri.com | admin123 |
| PRODUCTEUR (Koné Mamadou) | producteur@smartagri.com | producteur123 |
| ACHETEUR (Diallo Fatou) | acheteur@smartagri.com | acheteur123 |
| LOGISTIQUE (Traoré Seydou) | logisticien@smartagri.com | logisticien123 |
| AGENT_RELAIS (N'Guessan Aminata) | agent@smartagri.com | agent123 |
| PRODUCTEUR (Bamba Youssouf) | bamba@smartagri.com | bamba123 |

## Données de simulation (DataInitializer.java)
- 8 catégories, 15 produits, 10 cours semences, 6 annonces matériel
- 8 articles forum, 2 conversations, 5 évaluations
- 3 commandes + lignes + paiements, 3 produits vedettes
- 2 demandes livraison + suivi, 5 contenus apprentissage

## Structure clé
```
backend/src/main/java/com/smartagrimarket/
├── config/DataInitializer.java      # Seed 80+ enregistrements
├── controller/                      # API REST (10 controllers)
├── dto/                             # Request/Response DTOs
├── entity/                          # 16 entités JPA
├── repository/                      # 16 repositories
├── security/                        # SecurityConfig, JWT, filter
└── service/                         # Business logic (9 services)

frontend/src/app/
├── core/                            # Guards, interceptors, services, models
├── features/                        # Modules (accueil, auth, admin, marketplace,
│                                    # materiel, forum, messagerie, logistique, profil)
└── layouts/main/                    # Topbar + bottom-nav mobile
```

## Ce qui fonctionne / a été testé
- [x] Backend compile et démarre avec profil dev (H2)
- [x] Frontend build et serve (--poll=2000)
- [x] `npx ng build --configuration production` OK (warnings budget only)
- [x] CORS configuré (localhost:4200 → localhost:8080)
- [x] Login / Register via API (curl + navigateur)
- [x] Données de seed visibles via API REST
- [x] Tous les modules frontend chargés (lazy)
- [x] AdminGuard, AuthGuard
- [x] `/uploads/**` servis par Spring + proxy dev (proxy.conf.json) et nginx

## Images du seed (état au 13/10/2026)
- Produits → `frontend/src/assets/product-*.jpg` (chemin relatif, servi par Angular)
- Matériel → `/uploads/materiel-*.jpg` (fichiers dans `backend/uploads/`, servis par Spring,
  proxy dev `/uploads` → :8080, proxy nginx `/uploads/` → backend)
- Remplacements récents (sources CC sur Wikimedia Commons, voir `CREDITS_IMAGES.md`) :
  product-jus (bissap), product-tomate, materiel-moulin, materiel-pulverisateur, materiel-filets
- Assets inutilisés (candidats au nettoyage) : `agriculture-bg.jpg`, `hero-farm.jpg`,
  `hero-farm2.jpg`, `hero-agriculture.jpg`, `leaf.png`, et les 7 `assets/materiel-*.jpg`
  (doublons de `backend/uploads/`, 0 référence dans le code)

## Docker (testé et fonctionnel le 13/10/2026)
- `nginx.conf` : locations `/api/`, `/ws` (WebSocket) **et `/uploads/`** proxygés vers `backend:8080`
- `Dockerfile.backend` : `COPY backend/uploads ./uploads` + dépôt Maven local injecté
  via `build.additional_contexts.m2` → `mvn -o package` (Central inaccessible des conteneurs,
  débit ~5-30 kB/s) ; `MAVEN_OPTS=-Djava.net.preferIPv4Stack=true`
- `Dockerfile.frontend` : chemin de sortie corrigé (`smartagrimarket-frontend/browser`),
  `.npmrc` copié (`legacy-peer-deps`), `NODE_OPTIONS=--dns-result-order=ipv4first`
- `angular.json` : `optimization.fonts.inline: false` (build prod sans Google Fonts)
- `docker-compose.yml` : `${DB_PORT:-5432}` et `${HTTP_PORT:-80}` (ports de la machine),
  plus de `network: host` (le DNS des conteneurs de build fonctionne)
- `.env` (gitignoré) : `DB_PORT=5434`, `HTTP_PORT=8082` — ports déjà pris en local
- `.dockerignore` : node_modules, dist, target, .angular
- Stack vérifiée : db healthy, backend `/api/health` OK, seed PostgreSQL OK,
  nginx sert l'app + proxy `/api` et `/uploads` (200)

## Render (déploiement gratuit, prêt le 14/10/2026)
- `render.yaml` (Blueprint) : web free (Docker, frankfurt) + Postgres free (expire 30 j)
- `Dockerfile.render` : image unique nginx:1.27-alpine + JRE 21 (apk) ; stages node (ng build
  prod) + maven **en ligne** (pas de contexte m2 — Render a un bon réseau) ; `JAVA_OPTS=-Xmx320m`
  (RAM free = 512 Mo) ; `EXPOSE 10000` (env `PORT=10000`)
- `deploy/40-start-backend.sh` (dans `/docker-entrypoint.d/` de l'image nginx) : convertit
  `DATABASE_URL` postgres:// en `SPRING_DATASOURCE_URL` jdbc (via PG* si dispo, sinon parsing),
  lance java sur 8081, attend `/api/health` (180 s max), puis nginx démarre
- `deploy/nginx-render.conf.template` : même proxy que nginx.conf mais `127.0.0.1:${BACKEND_PORT}`
- `websocket.service.ts` : `wss://` auto sur pages https (fix pour Render qui est en HTTPS)
- Testé en local (image runtime + Postgres 16 jetable, `DATABASE_URL` simulé) :
  health 200 en 24 s, SPA 200, `/api/categories` OK, seed OK, `/uploads/*.jpg` 200, WS 101

## URLs
- Dev : frontend `http://localhost:4200` (ng serve --poll=2000) → API `localhost:8080`
- Docker : `http://localhost:8082` (nginx) → API `localhost:8080` → pg `localhost:5434`
- Render : `https://smartagrimarket-xxxx.onrender.com` (après Apply du Blueprint)

## Bloqueurs connus
- PostgreSQL local : impossible de se connecter (pas de sudo pour modifier pg_hba.conf)
- Solution : utiliser le profil `dev` (H2) pour le développement
- ENOSPC (file watchers) : contourné par `--poll=2000`
