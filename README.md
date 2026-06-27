# SmartAgriMarket V2

Plateforme de marketplace agricole directe producteur-consommateur, avec messagerie intégrée, bourse d'échange de matériel, forum communautaire et suivi logistique.

## Architecture

- **Frontend** : Angular 18 (standalone components, lazy loading)
- **Backend** : Spring Boot 3.4 (REST API, JWT auth)
- **Base de données** : H2 (développement) / PostgreSQL (production)
- **Authentification** : JWT (Bearer token)

## Modules

| Module | Fonctionnalités |
|--------|----------------|
| Marketplace | Catalogue avec recherche/filtres, panier, commande, dashboard vendeur |
| Bourse matériel | Annonces vente/échange de matériel agricole |
| Messagerie | Conversation privée anti-contournement |
| Forum & Apprentissage | Articles, catégories, modération |
| Logistique | Suivi de livraison, timeline |
| Admin | Modération forum, validation contenus, gestion utilisateurs |

## Utilisateurs de démo (créés automatiquement)

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | `admin@smartagri.com` | `admin123` |
| Producteur | `producteur@smartagri.com` | `producteur123` |
| Acheteur | `acheteur@smartagri.com` | `acheteur123` |

## Démarrage rapide (développement)

```bash
# Backend (H2 intégré, zéro configuration)
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend (autre terminal)
cd frontend
npm install
ng serve
```

Ouvrir http://localhost:4200 puis cliquer **Connexion**.

## Production (Docker)

```bash
docker compose up -d          # PostgreSQL
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run
```

Voir [INSTALL.md](INSTALL.md) pour les instructions détaillées (Linux, Windows, macOS).

## API publique

- `GET /api/produits` — Liste paginée des produits
- `GET /api/categories` — Catégories
- `GET /api/cours-semences` — Cours des semences
- `GET /api/materiel` — Annonces matériel
- `GET /api/forum/articles` — Articles du forum
- `POST /api/auth/login` — Connexion
- `POST /api/auth/register` — Inscription

## Sécurité

- Authentification par JWT (localStorage)
- Intercepteur HTTP injectant `Authorization: Bearer`
- AuthGuard sur les routes protégées
- AdminGuard vérifiant le rôle `ADMIN`
- API REST sans état
