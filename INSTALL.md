# Guide d'installation

## Prérequis

- **Java 21** (OpenJDK recommandé — Lombok incompatible Java 25+)
- **Node.js 20+** et **npm**
- **Maven 3.9+**
- **Angular CLI 18+** : `npm install -g @angular/cli`
- **PostgreSQL 15+** (optionnel — un profil H2 intégré existe)

---

## Démarrage rapide (développement — zéro configuration)

Cette méthode utilise H2, une base de données embarquée. Aucune installation PostgreSQL nécessaire.

```bash
# 1. Backend
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 2. Frontend (autre terminal)
cd frontend
npm install
ng serve

# 3. Ouvrir http://localhost:4200
```

> **Note** : Adaptez `JAVA_HOME` selon votre système (voir sections spécifiques ci-dessous).

---

## Installation avec PostgreSQL

### Linux (Debian/Ubuntu)

```bash
# Dépendances
sudo apt update
sudo apt install openjdk-21-jdk maven nodejs npm postgresql postgresql-client
sudo npm install -g @angular/cli

# Base de données
sudo -u postgres psql -c "CREATE USER smartagri WITH PASSWORD 'smartagri';"
sudo -u postgres psql -c "CREATE DATABASE smartagrimarket OWNER smartagri;"

# Backend
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run

# Frontend
cd frontend
npm install
ng serve --open
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
ng serve --open
```

### macOS

```bash
# Dépendances
brew install openjdk@21 maven node postgresql@16
npm install -g @angular/cli
brew services start postgresql@16

# Base de données
createdb smartagrimarket

# Backend
cd backend
JAVA_HOME=/usr/local/opt/openjdk@21 mvn spring-boot:run

# Frontend
cd frontend
npm install
ng serve --open
```

### Docker (PostgreSQL uniquement)

Alternative à l'installation locale de PostgreSQL :

```bash
docker compose up -d
# Puis lancer le backend (sans profil dev)
cd backend && JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run
```

---

## Configuration

### Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `DB_USERNAME` | `postgres` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | `postgres` | Mot de passe PostgreSQL |
| `JWT_SECRET` | (valeur par défaut) | Clé JWT (min 256 bits) |

Exemple :
```bash
DB_USERNAME=smartagri DB_PASSWORD=smartagri mvn spring-boot:run
```

### Profils Spring Boot

| Profil | Base de données | Usage |
|--------|----------------|-------|
| `dev` | H2 (mémoire) | Développement, démo |
| *(aucun)* | PostgreSQL | Production |

---

## Utilisateurs de démo

Créés automatiquement au premier démarrage :

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| **Administrateur** | `admin@smartagri.com` | `admin123` |
| **Producteur** | `producteur@smartagri.com` | `producteur123` |
| **Acheteur** | `acheteur@smartagri.com` | `acheteur123` |

---

## Vérification

1. Backend : `curl http://localhost:8080/api/categories` → `[]`
2. Frontend : http://localhost:4200 → page d'accueil
3. Connexion : `admin@smartagri.com` / `admin123`
4. Admin : bouton **Admin** dans la topbar

---

## Problèmes courants

**Lombok ne compile pas** → Lombok 1.18.x ne supporte pas Java 25+. Utilisez Java 21 :
```bash
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn compile
```

**Port déjà utilisé** :
```bash
lsof -ti:8080 | xargs kill    # Linux / macOS
# ou changer dans application.yml : server.port=8081
```

**Base de données refuse la connexion** → PostgreSQL n'est pas requis pour le développement. Utilisez le profil `dev` :
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
