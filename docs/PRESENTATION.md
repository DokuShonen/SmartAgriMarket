# SmartAgriMarket V2 — Présentation (15 min)

---

## Slide 1 — Page de titre (30s)

**SmartAgriMarket V2**
*Marketplace agricole directe producteur-consommateur*

- Plateforme web fullstack
- Développée par SmartAgriChange SARL
- Cible : marché burkinabè (producteurs, acheteurs, partenaires logistiques)

> 💡 *« Connecter directement le producteur à l'acheteur, sans intermédiaire »*

---

## Slide 2 — Le problème (1min)

### Contexte au Burkina Faso

- **60%+** de la population active dans l'agriculture
- Filière de commercialisation fragmentée
- Les producteurs vendent à bas prix aux intermédiaires
- Les acheteurs paient cher sans garantie de qualité
- Pas de suivi de livraison fiable
- Communication limitée (téléphone, marchés physiques)

### Ce qu'on résout

| Problème | Solution SmartAgriMarket |
|----------|--------------------------|
| Intermédiaires multiples | Marketplace directe producteur → acheteur |
| Pas de confiance | Système d'évaluations + badges vendeurs |
| Logistique opaque | Suivi de livraison en temps réel |
| Pas de communauté | Forum + messagerie intégrée |
| Matériel inaccessible | Bourse d'échange de matériel agricole |

---

## Slide 3 — Architecture technique (1min30)

### Stack technologique

```
┌─────────────────────────────────────────┐
│            Frontend Angular 18          │
│   PWA · Standalone Components · RxJS    │
│         Mobile-first responsive         │
├─────────────────────────────────────────┤
│         Backend Spring Boot 3.4         │
│   REST API · JWT · WebSocket (STOMP)    │
│      Java 21 · Spring Security          │
├─────────────────────────────────────────┤
│           PostgreSQL 16                 │
│         22 entités · 22 tables          │
└─────────────────────────────────────────┘
```

### Points clés

- **Frontend** : 42 composants standalone, lazy-loading par module, PWA
- **Backend** : 21 contrôleurs, 16 services, authentification JWT stateless
- **Infrastructure** : Docker Compose (3 services), Nginx, ngrok pour dev
- **Temps réel** : WebSocket STOMP pour la messagerie instantanée

---

## Slide 4 — Les modules fonctionnels (1min)

### 7 modules principaux

| # | Module | Description |
|---|--------|-------------|
| 🛒 | **Marketplace** | Catalogue, panier, commandes, paiement |
| 🚜 | **Matériel** | Bourse d'échange de matériel agricole |
| 💬 | **Messagerie** | Conversations privées temps réel |
| 📚 | **Forum** | Articles communautaires + apprentissage |
| 🚚 | **Logistique** | Suivi de livraison en temps réel |
| ⚙️ | **Administration** | Modération, stats, paramètres |
| 👤 | **Profil** | Inscription multi-étapes, gestion du compte |

---

## Slide 5 — Marketplace en détail (1min30)

### Flux utilisateur complet

```
Découverte → Détail produit → Panier → Commande → Paiement → Suivi
```

### Fonctionnalités

- **Recherche avancée** : mot-clé, catégorie, localité, fourchette de prix
- **8 catégories** : fruits, légumes, céréales, transformés, élevage, semences, épices, miel
- **Panier intelligent** : même producteur obligatoire, calcul automatique des totaux
- **Paiement** : paiement direct ou à la livraison (YengaPay Orange Money / Moov Money)
- **Évaluations** : système d'étoiles + commentaires après livraison
- **Produits vedettes** : gérés par l'administration

### Rôle du producteur

- Publier des produits avec photos
- Gérer le stock et les prix
- Consigner les commandes (confirmer → préparer → expédier)
- Dashboard de ventes avec statistiques

---

## Slide 6 — Messagerie & Communauté (1min)

### Messagerie temps réel

- Conversations privées via WebSocket STOMP
- **Filtre anti-circumvention** : masquage automatique des numéros de téléphone et emails
- Système de violations → suspension automatique après 3 signalements
- Indicateur de frappe (typing indicator)

### Forum communautaire

- Articles par catégories (Marché, Conseils, Cultures, Santé, Matériel)
- Système de commentaires avec likes
- Contenus d'apprentissage validés par les admin
- Modération par les administrateurs

---

## Slide 7 — Logistique & Suivi (1min)

### Nouveau flux de livraison (sans intermédiaire)

```
Producteur confirme     →  Préparation  →  Expédition  →  Client confirme réception
      (CONFIRMEE)           (EN_PREPARATION)  (EN_COURS_LIVRAISON)      (LIVREE)
```

### Fonctionnalités

- **Demande de livraison** créée automatiquement lors de l'expédition
- **Timeline de suivi** : chaque étape est tracée avec localisation et horodatage
- **Interface producteur** : boutons "Préparer" → "Envoyer"
- **Interface client** : visualisation du suivi + bouton "Confirmer réception"
- **Notifications** : alertes à chaque changement de statut

---

## Slide 8 — Sécurité & Rôles (1min)

### 6 rôles utilisateurs

| Rôle | Accès |
|------|-------|
| **ACHETEUR** | Acheter, évaluer, suivre les commandes |
| **PRODUCTEUR** | Vendre, gérer stock, expédier |
| **AGENT_RELAIS** | Saisie des cours semences, accompagnement |
| **ADMIN** | Modération, paramètres, statistiques |
| **SUPER_ADMIN** | Tout + gestion des comptes admin |
| **LOGISTIQUE** | Dashboard livraison *(en cours de déprecation)* |

### Sécurité

- JWT avec expiration de 7 jours
- Interceptor HTTP + route guards Angular
- BCrypt (coût ≥ 10) pour les mots de passe
- Filtrage des contenus sensibles dans les messages
- Suspension automatique après 3 violations

---

## Slide 9 — Chiffres du projet (30s)

### Métriques de développement

| Métrique | Valeur |
|----------|--------|
| **Lignes de code total** | ~23 000 |
| Backend (Java) | ~6 500 lignes, 132 fichiers |
| Frontend (TypeScript/CSS) | ~16 500 lignes, 121 fichiers |
| **Composants Angular** | 42 |
| **Contrôleurs Spring** | 21 |
| **Entités base de données** | 22 |
| **Services backend** | 16 |
| **Routes lazy-loaded** | 7 modules |
| **Comptes de démo** | 6 rôles différents |

---

## Slide 10 — Démonstration live (2min)

### Script de démo suggéré

1. **Inscription** — Createur de compte en 3 étapes (choix du type → infos → mot de passe)
2. **Catalogue** — Recherche et filtrage de produits
3. **Détail produit** — Voir les informations, ajouter au panier
4. **Panier → Commande** — Validation et paiement
5. **Messagerie** — Conversation avec un producteur
6. **Dashboard producteur** — Consigner et expédier la commande
7. **Suivi client** — Visualiser la timeline de livraison
8. **Forum** — Consulter les articles communautaires

---

## Slide 11 — Déploiement & Infrastructure (30s)

### Docker Compose

```yaml
services:
  db:        PostgreSQL 16
  backend:   Spring Boot (port 8080)
  frontend:  Angular + Nginx (port 80)
```

### Environnements

| Environnement | Base de données | Usage |
|---------------|----------------|-------|
| **Dev** | H2 in-memory | Développement local |
| **Production** | PostgreSQL 16 | Déploiement Docker |

### Outils

- **ngrok** : exposition des APIs pour les tests mobiles
- **Nginx** : reverse proxy + serving du frontend
- **Orange API** : envoi SMS/OTP (production)
- **YengaPay** : intégration Mobile Money

---

## Slide 12 — Perspectives & Améliorations futures (30s)

### Court terme

- [ ] Notifications push (Firebase Cloud Messaging)
- [ ] Mode hors-ligne (Service Worker avancé)
- [ ] Application mobile native (Capacitor / React Native)

### Moyen terme

- [ ] Intégration paiement complet (YengaPay en production)
- [ ] Géolocalisation des producteurs
- [ ] Système de réservation de matériel
- [ ] Analytics dashboard avancé

### Long terme

- [ ] Expansion regionale (Côte d'Ivoire, Mali, Niger)
- [ ] IA pour recommandation de produits
- [ ] Blockchain pour traçabilité alimentaire

---

## Slide 13 — Conclusion (30s)

### Ce qu'on a construit

> **SmartAgriMarket** est une plateforme complète qui connecte directement les producteurs agricoles burkinabès à leurs acheteurs, avec :

- ✅ Marketplace avec catalogue, panier et paiement
- ✅ Messagerie temps réel avec filtre anti-circumvention
- ✅ Forum communautaire et contenu d'apprentissage
- ✅ Suivi de livraison en temps réel
- ✅ Bourse d'échange de matériel agricole
- ✅ Administration complète avec modération
- ✅ Architecture scalable et sécurisée

### Stack technique

**Angular 18** · **Spring Boot 3.4** · **PostgreSQL 16** · **Docker**

---

*SmartAgriMarket — Par SmartAgriChange SARL*
*Présenté le [DATE]*
