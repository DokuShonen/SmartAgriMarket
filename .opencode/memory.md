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

## Docker
- `nginx.conf` : location `/uploads/` proxygé vers backend (ajouté le 13/10)
- `Dockerfile.backend` : `COPY backend/uploads ./uploads` (seed d'images dans le volume nommé)
- `Dockerfile.frontend` : chemin de sortie corrigé → `dist/smartagrimarket-frontend/browser`
- `.dockerignore` ajouté (node_modules, dist, target, .angular)

## Bloqueurs connus
- PostgreSQL local : impossible de se connecter (pas de sudo pour modifier pg_hba.conf)
- Solution : utiliser le profil `dev` (H2) pour le développement
- ENOSPC (file watchers) : contourné par `--poll=2000`
