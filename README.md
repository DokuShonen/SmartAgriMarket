# SmartAgriMarket V2

Plateforme de marketplace agricole directe producteur-consommateur, avec messagerie intégrée, bourse d'échange de matériel, forum communautaire et suivi logistique.

## Architecture

- **Frontend** : Angular 18 (standalone components, lazy loading, PWA)
- **Backend** : Spring Boot 3.4 (REST API, JWT auth, Java 21)
- **Base de données** : H2 (développement) / PostgreSQL (production)
- **Authentification** : JWT (Bearer token)

## Modules

| Module | Fonctionnalités |
|--------|----------------|
| Marketplace | Catalogue avec recherche/filtres, panier, commande, dashboard vendeur, paiement |
| Bourse matériel | Annonces vente/échange de matériel agricole, propositions d'échange |
| Messagerie | Conversation privée avec filtre anti-contournement (coordonnées masquées) |
| Forum & Apprentissage | Articles, commentaires, likes, contenu pédagogique validé |
| Logistique | Demandes de livraison, suivi timeline, tableau de bord partenaire |
| Administration | Modération forum, validation contenus, gestion utilisateurs, prix SONAGESS, produits vedettes, signalements |
| Profil | Photo de profil, évaluations, historique commandes/ventes |

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `ACHETEUR` | Marketplace, panier, commande, messagerie, forum |
| `PRODUCTEUR` | Publier annonces produits & matériel, gérer stock, messagerie, forum |
| `LOGISTIQUE` | Tableau de bord livraison, prise en charge, mise à jour statut course |
| `AGENT_RELAIS` | Saisie des cours de semences locaux |
| `ADMIN` | Modération, gestion SONAGESS, produits vedettes, validation comptes |
| `SUPER_ADMIN` | Accès admin complet + gestion des administrateurs |

## Utilisateurs de démo (créés automatiquement)

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | `admin@smartagri.com` | `admin123` |
| Super Admin | `superadmin@smartagri.com` | `superadmin123` |
| Producteur | `producteur@smartagri.com` | `producteur123` |
| Acheteur | `acheteur@smartagri.com` | `acheteur123` |
| Logistique | `logistique@smartagri.com` | `logistique123` |
| Agent Relais | `agent@smartagri.com` | `agent123` |

## Démarrage rapide (développement)

```bash
# Backend (H2 intégré, zéro configuration)
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend (autre terminal)
cd frontend
npm install
npx ng serve --poll=2000
```

Ouvrir http://localhost:4200 puis cliquer **Connexion**.

## Production (Docker)

```bash
# Construire les 3 images (backend Java, frontend Angular + nginx, PostgreSQL)
docker compose build

# Démarrer la stack (web :80, API :8080, PostgreSQL :5432)
# Ports pris ? printf 'DB_PORT=5434\nHTTP_PORT=8082\n' > .env
docker compose up -d

# État et logs
docker compose ps
docker compose logs -f backend
```

- Le seed (catégories, produits, comptes de démo) s'exécute au premier démarrage du backend.
- Les images du matériel sont copiées dans l'image backend (`backend/uploads/`) puis exposées
  via le volume Docker `uploads` sur `http://localhost/uploads/...` (proxy nginx → backend).
- Arrêt : `docker compose down` (ajouter `-v` pour supprimer aussi la base).

Voir [INSTALL.md](INSTALL.md) pour les instructions détaillées (Linux, Windows, macOS).

## Déploiement gratuit (Render)

```bash
# 1. Le dépôt est déjà sur GitHub : https://github.com/DokuShonen/SmartAgriMarket
# 2. render.com → New + → Blueprint → sélectionner ce dépôt
# 3. Apply : crée le service web (plan free) + une Postgres free, puis un push sur main
#    redéploie automatiquement
```

Blueprint [`render.yaml`](render.yaml) + [`Dockerfile.render`](Dockerfile.render) : un seul
conteneur (nginx + Angular + Spring Boot), base PostgreSQL gérée par Render. Limites et
migration vers une base gratuite permanente (Neon) : voir [INSTALL.md](INSTALL.md).

## Données de démonstration & images

- Le seed est généré par `backend/src/main/java/com/smartagrimarket/config/DataInitializer.java`
  (8 catégories, 20 produits, 7 annonces matériel, 10 cours, 8 articles forum, commandes, livraisons…).
- **Produits** → images locales `frontend/src/assets/product-*.jpg` (servies par Angular).
- **Matériel** → images `backend/uploads/materiel-*.jpg` servies par Spring sous `/uploads/`
  (proxy dev `proxy.conf.json`, proxy prod `nginx.conf`).
- Les images proviennent de Wikimedia Commons : attribution détaillée dans
  [CREDITS_IMAGES.md](CREDITS_IMAGES.md).

## API publique

### Authentification
- `POST /api/auth/login` — Connexion
- `POST /api/auth/register` — Inscription

### Marketplace
- `GET /api/produits` — Liste paginée des produits
- `GET /api/produits/{id}` — Détail produit
- `GET /api/categories` — Catégories

### Cours & Prix
- `GET /api/cours-semences` — Cours des semences
- `GET /api/prix-sonagess` — Prix de référence SONAGESS (public)

### Bourse matériel
- `GET /api/materiel` — Annonces matériel
- `GET /api/echanges` — Propositions d'échange

### Forum
- `GET /api/forum/articles` — Articles du forum
- `GET /api/commentaires` — Commentaires
- `GET /api/contenus-apprentissage` — Contenus pédagogiques

### Autres
- `GET /api/produits/vedettes` — Produits vedettes
- `GET /api/evaluations` — Évaluations utilisateurs
- `GET /api/notifications` — Notifications

## Sécurité

- Authentification par JWT (localStorage)
- Intercepteur HTTP injectant `Authorization: Bearer`
- Guards Angular : `authGuard`, `adminGuard`, `producteurGuard`
- `SecurityUtil.checkAdmin()` côté backend pour les opérations admin
- Filtre anti-contournement : téléphone, email, liens masqués dans la messagerie
- Suspension automatique après violations répétées

## Diagrammes UML

Les diagrammes de conception sont dans le dossier [`diagrammes/`](diagrammes/) :
- `01-use-case.md` — Cas d'utilisation
- `02-classes.md` — Diagramme de classes
- `03-sequence-commande.md` — Séquence commande
- `04-activite-commande.md` — Activité commande
- `05-sequence-messagerie.md` — Séquence messagerie
- `06-deploiement.md` — Déploiement
