# Guide d'installation — SmartAgriMarket V2

## Prérequis

- **Java 21** (OpenJDK — Lombok incompatible Java 25+)
- **Node.js 20+** et **npm**
- **Maven 3.9+**
- **Angular CLI 18+** : `npm install -g @angular/cli`
- **PostgreSQL 15+** (optionnel — un profil H2 intégré existe)

---

## Démarrage rapide (zéro configuration)

H2 embarquée, aucune installation PostgreSQL nécessaire.

```bash
# 1. Backend
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 2. Frontend (autre terminal)
cd frontend
npm install
npx ng serve --poll=2000

# 3. Ouvrir http://localhost:4200
```

> Adaptez `JAVA_HOME` selon votre système (voir sections spécifiques ci-dessous).

---

## Installation avec PostgreSQL

### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install openjdk-21-jdk maven nodejs npm postgresql postgresql-client
sudo npm install -g @angular/cli

sudo -u postgres psql -c "CREATE USER smartagri WITH PASSWORD 'smartagri';"
sudo -u postgres psql -c "CREATE DATABASE smartagrimarket OWNER smartagri;"

cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run

cd frontend
npm install
npx ng serve --poll=2000 --open
```

### Windows

1. **Java 21** : https://adoptium.net/temurin/releases/?version=21
2. **Node.js 20+** : https://nodejs.org
3. **Maven** : https://maven.apache.org/download.cgi (ajouter `bin/` au PATH)
4. **PostgreSQL** : https://www.postgresql.org/download/windows/
5. **Angular CLI** : `npm install -g @angular/cli`

```powershell
# Base de données (pgAdmin ou psql)
CREATE USER smartagri WITH PASSWORD 'smartagri';
CREATE DATABASE smartagrimarket OWNER smartagri;

# Backend
cd backend
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.xx-hotspot
mvn spring-boot:run

# Frontend
cd frontend
npm install
npx ng serve --poll=2000 --open
```

### macOS

```bash
brew install openjdk@21 maven node postgresql@16
npm install -g @angular/cli
brew services start postgresql@16

createdb smartagrimarket

cd backend
JAVA_HOME=/usr/local/opt/openjdk@21 mvn spring-boot:run

cd frontend
npm install
npx ng serve --poll=2000 --open
```

### Docker (PostgreSQL uniquement)

```bash
docker compose up -d db
cd backend && JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run
```

---

## Déploiement complet avec Docker

Toute la stack (PostgreSQL + API Spring Boot + frontend Angular servi par nginx) peut tourner
dans des conteneurs :

```bash
# 1. Construction des images (backend + frontend)
docker compose build

# 2. Démarrage
docker compose up -d

# 3. Vérification
docker compose ps                 # 3 services "running"
curl http://localhost:8080/api/health
curl http://localhost/api/categories
```

| Service | Port | Rôle |
|---------|------|------|
| `frontend` (nginx) | **80** | Application Angular + proxy `/api/` et `/uploads/` |
| `backend` (Spring Boot, profil `prod`) | **8080** | API REST, JWT, WebSocket |
| `db` (PostgreSQL 16) | **5432** | Base de données |

Commandes utiles :

```bash
docker compose logs -f backend     # logs API
docker compose logs -f frontend    # logs nginx
docker compose down                # arrêt (conserve la base)
docker compose down -v             # arrêt + suppression de la base et des uploads
docker compose build --no-cache    # reconstruction propre
```

Détails d'implémentation :

- `Dockerfile.backend` : build Maven multi-stage, copie `backend/uploads/` dans l'image
  (Docker initialise le volume nommé `uploads` avec ces fichiers au premier lancement).
- `Dockerfile.frontend` : build Angular (`ng build --configuration production`) puis nginx.
- `nginx.conf` : `location /api/` et `location /uploads/` sont proxygés vers `backend:8080`
  — indispensable, sinon les photos de matériel renvoient 404.
- `.dockerignore` : exclut `node_modules`, `dist`, `target`, `.angular`.
- `frontend/.npmrc` : `legacy-peer-deps=true` — requis par `npm ci` dans le conteneur
  (`ng2-charts@10` déclare des peers Angular ≥ 21 alors que le projet est en Angular 18).

---

## Configuration

### Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `DB_USERNAME` | `postgres` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | `postgres` | Mot de passe PostgreSQL |
| `JWT_SECRET` | (valeur par défaut) | Clé JWT HMAC-SHA (min 256 bits) |
| `JWT_EXPIRATION` | `86400000` (24h) | Durée de vie du token en ms |

### Profils Spring Boot

| Profil | Base de données | Usage |
|--------|----------------|-------|
| `dev` | H2 (mémoire) | Développement, démo |
| *(aucun)* | PostgreSQL | Production |

### SMS / Appels (optionnel)

| Propriété | Valeur par défaut | Description |
|-----------|-------------------|-------------|
| `sms.provider` | `logging` | `logging` (console) ou `orange` (API Orange) |

---

## Utilisateurs de démo

Créés automatiquement au premier démarrage (DataInitializer) :

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| **Super-admin** | `admin@smartagri.com` | `admin123` |
| **Producteur** | `producteur@smartagri.com` | `producteur123` |
| **Acheteur** | `acheteur@smartagri.com` | `acheteur123` |
| **Logistique** | `logisticien@smartagri.com` | `logisticien123` |
| **Agent relais** | `agent@smartagri.com` | `agent123` |
| **Producteur 2** | `bamba@smartagri.com` | `bamba123` |

Les comptes admin (SUPER_ADMIN, MODERATION_SUPPORT, MODERATION_FORUM, ADMIN_TECHNIQUE) ne sont pas créés automatiquement — ils s'ajoutent via `POST /api/admin/utilisateurs` par un super-admin.

---

## Vérification

1. **Backend** : `curl http://localhost:8080/api/categories` → JSON de 8 catégories
2. **Frontend** : http://localhost:4200 → page d'accueil avec produits vedettes + cours semences
3. **Connexion** : `admin@smartagri.com` / `admin123`
4. **Admin** : bouton **Admin** visible dans la topbar (SUPER_ADMIN ou autres rôles admin)
5. **Commande** : ajouter un produit au panier → passer commande → le vendeur confirme → l'acheteur paie

---

## Architecture fonctionnelle

### Flux de commande (2 étapes)

Selon le cahier des spécifications, la commande suit un flux en 2 étapes distinctes :

```
1. Acheteur passe commande → statut EN_ATTENTE
   → Notification au vendeur

2. Vendeur confirme → statut CONFIRMEE (commande ferme)
   → Notification à l'acheteur

3. Acheteur choisit le paiement :
   - PAIEMENT_DIRECT (Mobile Money) → paiement immédiat
   - PAIEMENT_LIVRAISON → paiement à la réception (mode privilégié)

4. Si livraison → Partenaire logistique prend en charge
   → Suivi : PRISE_EN_CHARGE → EN_TRANSIT → ARRIVÉE → LIVRÉ
```

### Rôles administrateurs

| Rôle | Accès |
|------|-------|
| **SUPER_ADMIN** | Accès total, crée d'autres admins, paramètres critiques |
| **MODERATION_SUPPORT** | Validation vendeurs, gestion messages, signalements |
| **MODERATION_FORUM** | Modération articles forum, contenus apprentissage |
| **ADMIN_TECHNIQUE** | Statistiques, maintenance |

### Module matériel

En An 1, le module matériel propose la **vente** et la **location** d'équipements agricoles. L'échange (troc) n'est pas inclus dans cette phase (spec §8).

### Messagerie anti-contournement

- Filtrage automatique des numéros de téléphone, emails et URLs dans les messages
- Violations accumulées par utilisateur
- Suspension automatique à 3 violations
- Filtrage aussi appliqué aux messages du forum

### Forum

Un seul fil de discussion chronologique (pas de catégories). Pseudo forum déconnecté de l'identité réelle.

---

## Endpoints API principaux

### Auth
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |

### Commandes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/commandes` | Passer une commande (EN_ATTENTE) |
| POST | `/api/commandes/{id}/confirmer` | Vendeur confirme → CONFIRMEE |
| POST | `/api/commandes/{id}/payer` | Acheteur paie (`methode`: PAIEMENT_DIRECT ou PAIEMENT_LIVRAISON) |
| PATCH | `/api/commandes/{id}/statut?statut=` | Modifier le statut |
| POST | `/api/commandes/{id}/confirmer-reception` | Confirmer réception → LIVREE |
| POST | `/api/commandes/{id}/rembourser` | Rembourser (si ANNULEE) |
| GET | `/api/commandes/acheteur` | Commandes de l'acheteur |
| GET | `/api/commandes/producteur` | Ventes du producteur |
| GET | `/api/commandes/all` | Toutes les commandes (admin) |

### Produits
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/produits` | Catalogue (filtres: keyword, categorieId, localite, prixMin, prixMax) |
| POST | `/api/produits` | Créer un produit (PRODUCTEUR) |
| GET | `/api/produits/vendeur/me` | Mes produits |

### Admin
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/stats` | Statistiques dashboard |
| GET | `/api/admin/messages` | Tous les messages (MODERATION_SUPPORT+) |
| DELETE | `/api/admin/messages/{id}` | Supprimer un message |
| POST | `/api/admin/utilisateurs` | Créer un admin (SUPER_ADMIN) |
| PATCH | `/api/utilisateurs/{id}/verifier` | Vérifier un vendeur |
| PATCH | `/api/utilisateurs/{id}/suspendre` | Suspendre un utilisateur |

---

## Problèmes courants

**Lombok ne compile pas** → Utilisez Java 21 :
```bash
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn compile
```

**Port 8080 déjà utilisé** :
```bash
lsof -ti:8080 | xargs kill -9    # Linux / macOS
# ou changer dans application.yml : server.port=8081
```

**Frontend ne démarre pas (inotify)** :
```bash
npx ng serve --poll=2000
```

**Base de données refuse la connexion** → Utilisez le profil dev (H2) :
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Build frontend échoue (fonts)** → Erreur réseau pour Google Fonts, le build fonctionne quand même. Si besoin, supprimez l'import `@import url(...)` dans `styles.css`.

**`npm ci` / `npm install` échoue avec `ERESOLVE` (ng2-charts)** :
`legacy-peer-deps=true` est défini dans `frontend/.npmrc` — conservez ce fichier (il est copié
dans l'image Docker). Sinon : `npm ci --legacy-peer-deps`.

**Photos de matériel en 404** → elles sont servies par le backend sous `/uploads/...` :
- dev : `proxy.conf.json` de ng serve proxifie `/uploads` vers `localhost:8080`
- Docker : `nginx.conf` proxifie `/uploads/` vers `backend:8080`
- les fichiers vivent dans `backend/uploads/` (copiés dans l'image Docker)

**Vérifier le seed** :
```bash
curl -s http://localhost:8080/api/produits | head -c 300
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/uploads/materiel-moulin.jpg   # 200
```

---
