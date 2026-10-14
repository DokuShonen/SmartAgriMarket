# Cahier des Charges — SmartAgriMarket V2

**Version :** 1.0  
**Date :** Juillet 2026  
**Rédaction :** Équipe SmartAgriChange / Développement  
**Références :** SmartAgriMarket_Specifications.docx, SmartAgriMarket V2 Document de cadrage.docx, methodologie_cdc.md

---

## Phase 1 : Recueil des Besoins & Analyse des Acteurs

### Règle 1 — Les 4 familles d'acteurs

**Sponsors**
| Acteur | Rôle |
|---|---|
| SmartAgriChange SARL | Finance le projet et valide la vision stratégique. Décide du périmètre du MVP et des priorités d'investissement. |

**Utilisateurs finaux**
| Acteur | Rôle |
|---|---|
| Producteur / vendeur | Publie ses produits et son matériel, gère ses stocks et ses commandes, échange avec les acheteurs via la messagerie interne, suit ses ventes. |
| Acheteur (particulier, commerçant, transformateur, institution) | Recherche des produits par catégorie et localité, commande, paie, suit la livraison, évalue les vendeurs. |
| Partenaire logistique | Reçoit les demandes de livraison, met à jour les statuts de course, confirme la livraison. |
| Agent-relais | Accompagne les producteurs peu connectés (onboarding, saisie des prix locaux). Rôle à confirmer. |

**Techniques**
| Acteur | Rôle |
|---|---|
| Administrateur technique (développeur) | Maintenance, déploiement, accès à l'infrastructure serveur, gestion de la base de données. |
| Administrateur plateforme (super-admin) | Accès total, gestion des comptes admin, paramètres critiques (commission, YengaPay). |
| Administrateur modération / support | Validation des vendeurs (badge coopérative), traitement des signalements, réponse aux utilisateurs. |

**Régulateurs**
| Acteur | Rôle |
|---|---|
| CIL (Commission Informatique et Libertés) | Impose les règles de protection des données personnelles. |
| ARCEP / autorités de régulation télécom | Cadre légal des transactions mobile money et de la collecte de données. |

### Règle 2 — Matrice de Mendelow

| Acteur | Pouvoir | Intérêt | Stratégie |
|---|---|---|---|
| SmartAgriChange SARL | Fort | Fort | Gérer étroitement |
| Producteur / vendeur | Faible | Fort | Informer / impliquer |
| Acheteur | Faible | Fort | Informer / impliquer |
| Partenaire logistique | Moyen | Moyen | Satisfaire |
| Super-admin | Fort | Fort | Gérer étroitement |
| Modération / support | Moyen | Fort | Satisfaire |
| Admin technique | Fort | Moyen | Satisfaire |
| CIL / régulateurs | Fort | Faible | Surveiller |
| Agent-relais | Faible | Moyen | Surveiller |

### Règle 3 — Analyse des besoins racines (5 Pourquoi)

*Application documentée lors des entretiens avec la direction :*

**Pourquoi une messagerie interne ?**  
1. Les acheteurs et vendeurs doivent communiquer → *Pour négocier les prix et les modalités.*  
2. Sans messagerie interne, ils utilisent WhatsApp/téléphone → *La plateforme perd le contrôle de la relation.*  
3. Si la relation passe hors plateforme → *Aucune commission n'est perçue, aucune donnée de transaction n'est collectée.*  
4. Sans données de transaction → *Impossible de bâtir un système de confiance (évaluations, historiques).*  
5. Sans confiance → *Les acheteurs ne reviennent pas, le modèle économique s'effondre.*

**Besoin racine identifié :** La messagerie interne n'est pas un module de confort ; c'est le verrou qui protège le modèle économique de la plateforme.

---

## Phase 2 : Cadrage et Limites du Projet

### Règle 4 — Périmètre inclus (V1 / MVP)

Le MVP (Phase 1) couvre :

1. **Marketplace de produits agricoles** — Catalogue 100 % agricole (produits vivriers, maraîchers, céréales, semences, intrants, transformés). Fiche produit (photos, description, prix, unité, quantité, localité). Recherche et filtres (catégorie, localité, prix). Tunnel de commande (panier, validation, suivi). Tableau de bord vendeur. Système d'évaluation.
2. **Messagerie interne sécurisée** — Discussion acheteur-vendeur rattachée à une annonce ou commande. Détection et masquage automatiques des numéros, e-mails et liens externes. Notifications in-app.
3. **Page d'accueil vitrine** — Produits vedettes de la semaine (gérés par admin). Cours des semences par localité (source SIM SONAGESS / N'Kalo, mise à jour hebdomadaire).
4. **Paiement** — Paiement à la livraison (mode privilégié) ou paiement direct. Mobile money via YengaPay (split payment automatique vendeur + commission). Cash (exception encadrée par agent).
5. **Inscription vendeur** — Deux niveaux : simple (nom, CNIB, fiche produit) et certifié (coopérative, badge après vérification agent-relais).
6. **Profils administrateurs** — Super-admin, modération/support, admin technique.

### Règle 5 — Exclusions explicites (Hors-champ V1 / "Won't Have")

Ne font **pas** partie du MVP et seront traités en V2 (ou ultérieur) :

| Fonctionnalité | Motif |
|---|---|
| Troc / échange de matériel agricole | Complexité supplémentaire (caution, calendrier, état des lieux) ; repoussé en V2. |
| Forum communautaire et espace d'apprentissage | Nécessite modération dédiée et production de contenu pédagogique ; priorité P3. |
| Location de matériel agricole | Fonctionnalité optionnelle du module Bourse d'échange ; non retenue en Phase 1. |
| Application mobile native | Plateforme web PWA uniquement en Phase 1 ; pas d'application à installer. |
| Mode hors-ligne / cache avancé | Stratégie à étudier pour V2 ; le site doit rester utilisable en faible connectivité mais sans garantie hors-ligne totale. |
| Pseudonymat forum | Sans objet tant que le forum n'est pas développé. |
| Langues locales | Français uniquement au lancement ; langues locales (audio inclus) en V2. |
| Interface dédiée service client | À évaluer ; le support est assuré via le profil modération/support dans un premier temps. |

---

## Phase 3 : Besoins Fonctionnels (BF)

### Règle 6 & 7 — User Stories (format : action pure)

#### Module 1 — Marketplace

| ID | En tant que... | Je veux... | Afin de... | Priorité |
|---|---|---|---|---|
| BF-01 | Producteur | publier une annonce avec photos, description, prix, unité, quantité et localité | présenter mes produits aux acheteurs | M |
| BF-02 | Producteur | modifier ou désactiver une annonce existante | gérer mon stock et ma disponibilité | M |
| BF-03 | Producteur | visualiser l'historique de mes ventes et les évaluations reçues | suivre mon activité commerciale | S |
| BF-04 | Acheteur | rechercher des produits par catégorie, localité et prix | trouver rapidement le produit qui correspond à mes besoins | M |
| BF-05 | Acheteur | consulter une fiche produit détaillée (photos, description, prix, localité du vendeur) | décider d'acheter en connaissance de cause | M |
| BF-06 | Acheteur | ajouter des produits à un panier et valider une commande | passer commande auprès du vendeur | M |
| BF-07 | Acheteur | noter et évaluer un vendeur après une transaction | partager mon expérience avec la communauté | S |
| BF-08 | Producteur | recevoir une notification de nouvelle commande | confirmer ou refuser la commande dans les délais | M |

#### Module 2 — Messagerie interne sécurisée

| ID | En tant que... | Je veux... | Afin de... | Priorité |
|---|---|---|---|---|
| BF-09 | Acheteur | démarrer une conversation avec un vendeur depuis une annonce | négocier les modalités de la vente | M |
| BF-10 | Utilisateur | envoyer et recevoir des messages textes dans la messagerie interne | communiquer sans quitter la plateforme | M |
| BF-11 | Utilisateur | voir mes numéros de téléphone et e-mails automatiquement masqués dans les messages entrants | protéger mes coordonnées personnelles | M |
| BF-12 | Utilisateur | recevoir une notification in-app pour un nouveau message | répondre rapidement sans recharger la page | S |
| BF-13 | Administrateur | consulter l'historique des messages signalés | modérer les échanges et sanctionner les contournements | S |

#### Module 3 — Page d'accueil vitrine

| ID | En tant que... | Je veux... | Afin de... | Priorité |
|---|---|---|---|---|
| BF-14 | Visiteur | voir les produits vedettes de la semaine sur la page d'accueil | découvrir les offres mises en avant | M |
| BF-15 | Visiteur | consulter les cours des semences par localité avec la date de dernière mise à jour | connaître les prix de référence du marché | M |
| BF-16 | Administrateur | sélectionner et publier les produits vedettes affichés sur l'accueil | mettre en avant certaines offres | M |

#### Module 4 — Paiement et logistique

| ID | En tant que... | Je veux... | Afin de... | Priorité |
|---|---|---|---|---|
| BF-17 | Acheteur | choisir entre paiement direct et paiement à la livraison | sélectionner le mode qui me convient | M |
| BF-18 | Acheteur | payer par mobile money (Orange Money, Moov Money) via YengaPay | régler ma commande sans espèces | M |
| BF-19 | Acheteur | suivre le statut de ma commande (confirmée, préparée, expédiée, livrée) | savoir où en est ma livraison | S |
| BF-20 | Partenaire logistique | recevoir les demandes de livraison et mettre à jour les statuts de course | assurer le suivi des livraisons | S |

#### Module 5 — Administration

| ID | En tant que... | Je veux... | Afin de... | Priorité |
|---|---|---|---|---|
| BF-21 | Super-admin | configurer le taux de commission plateforme | ajuster le modèle économique | M |
| BF-22 | Super-admin | configurer les paramètres de connexion YengaPay | activer les paiements mobile money | M |
| BF-23 | Modérateur | valider ou refuser une demande de badge coopérative | garantir la fiabilité des vendeurs certifiés | M |
| BF-24 | Modérateur | traiter les signalements d'utilisateurs | maintenir la qualité des échanges sur la plateforme | S |
| BF-25 | Administrateur | publier les cours des semences (alimentés par SIM SONAGESS / N'Kalo) | fournir des prix de référence actualisés | M |

#### Module 6 — Inscription et comptes

| ID | En tant que... | Je veux... | Afin de... | Priorité |
|---|---|---|---|---|
| BF-26 | Visiteur | m'inscrire en 3 étapes maximum (nom, localité, coordonnées) | créer un compte rapidement | M |
| BF-27 | Producteur | fournir mon numéro CNIB lors de l'inscription vendeur | permettre la vérification de mon identité | M |
| BF-28 | Producteur | fournir une photo de certification Bio pour obtenir un badge (vendeur certifié) | attester de ma qualité de producteur Bio | S |
| BF-29 | Agent-relais | vérifier physiquement un producteur et lui attribuer le badge certifié | valider les vendeurs sur le terrain | S |

---

## Phase 4 : Besoins Non-Fonctionnels (BNF) & Contraintes

### Règle 8 — Critères de qualité

**Performance**
| ID | Exigence | Test |
|---|---|---|
| BNF-01 | Le temps de chargement de la page d'accueil DOIT être inférieur à 3 secondes sur un réseau 3G. | Mesure au Lighthouse / WebPageTest en condition dégradée. |
| BNF-02 | Le temps de réponse de l'API REST DOIT être inférieur à 500 ms pour 95 % des requêtes (hors upload de fichier). | Test de charge avec JMeter / k6. |
| BNF-03 | Les images DOIVENT être compressées automatiquement au téléchargement (max 300 Ko par image, format WebP avec fallback JPEG). | Vérification du pipeline d'upload. |
| BNF-04 | La taille totale des ressources par page (HTML + CSS + JS + images) NE DOIT PAS dépasser 1,5 Mo. | Audit Lighthouse. |

**Sécurité**
| ID | Exigence | Test |
|---|---|---|
| BNF-05 | Les mots de passe DOIVENT être stockés hashés avec bcrypt (coût ≥ 10). | Revue de code et test d'intrusion. |
| BNF-06 | Toutes les communications DOIVENT transiter en HTTPS (TLS 1.2 minimum). | Scan SSL Labs. |
| BNF-07 | Les numéros de téléphone et e-mails DOIVENT être masqués automatiquement avant affichage dans la messagerie. | Test fonctionnel avec jeux de données. |
| BNF-08 | La plateforme NE DOIT PAS stocker les données bancaires des utilisateurs (pas de séquestre en Phase 1). | Revue de code. |

**Disponibilité**
| ID | Exigence | Test |
|---|---|---|
| BNF-09 | La plateforme DOIT être accessible 24h/24, 7j/7, avec un taux de disponibilité d'au moins 99,5 %. | Monitoring UptimeRobot / BetterStack. |
| BNF-10 | La session utilisateur DOIT être maintenue au moins 24 heures sans reconnexion. | Test de session cross-tab. |
| BNF-11 | Le système DOIT rester utilisable sans dégradation bloquante en cas de coupure réseau temporaire (champs saisis conservés localement). | Test de coupure navigateur. |

### Règle 9 — Contraintes du terrain

| ID | Contrainte |
|---|---|
| CT-01 | **Contexte mobile d'abord** — La majorité des utilisateurs accède au site depuis un smartphone d'entrée de gamme (Android 8+). L'interface DOIT être responsive et optimisée pour les petits écrans. |
| CT-02 | **Faible connectivité** — Le site DOIT rester fonctionnel en zone de couverture réseau faible ou instable (3G dégradée, latence élevée). |
| CT-03 | **Paiement mobile money** — L'intégration YengaPay DOIT prendre en charge Orange Money et Moov Money dès le MVP. |
| CT-04 | **Sources de prix institutionnelles** — Les cours des semences sont alimentés par le SIM SONAGESS et N'Kalo, avec une fréquence de mise à jour de 1 fois par semaine. |
| CT-05 | **Partenaires logistiques** — Okalm, TSR, Staff (national) ; Paps Logistique (sous-régional) ; CGE (international). |
| CT-06 | **Stack technique existante** — Backend Spring Boot (Java 21), frontend Angular 18 (TypeScript 5.5+), base de données PostgreSQL, déploiement conteneurisé (Docker). |
| CT-07 | **Cadre légal** — Conformité avec la réglementation burkinabè sur la protection des données personnelles et les transactions électroniques. |
| CT-08 | **Accessibilité** — Parcours d'inscription en 3 étapes maximum, interface à base d'icônes, gros boutons, une action principale par écran. |

---

## Phase 5 : Rigueur de Rédaction

### Règle 10 — Filtre SMART (aucun adjectif flou)

Toutes les exigences ci-dessus respectent le principe SMART :
- **S**pécifique — Une action unique par exigence.
- **M**esurable — Testable par Oui/Non (ex. : « temps de chargement < 3 secondes »).
- **A**tteignable — Techniquement réalisable dans l'état de l'art.
- **R**éaliste — Alignée sur les contraintes de terrain (faible connectivité, mobile d'abord).
- **T**emporellement défini — Rattachable à une phase ou un jalon.

Termes exclus du document : *rapide, facile, ergonomique, sécurisé, intuitive, fluide, robuste, simple* (sauf dans les noms propres).

### Règle 11 — Refus de l'implicite

- Le système DOIT afficher un message de confirmation après chaque action critique (passer commande, publier une annonce, envoyer un message).
- Le système DOIT demander une confirmation avant d'annuler une commande en cours.
- Le système NE DOIT PAS autoriser la commande d'une quantité supérieure au stock disponible annoncé.
- Le système DOIT envoyer une notification SMS à l'acheteur si le vendeur ne répond pas sous 48 heures, et lui proposer un vendeur alternatif.
- Le système DOIT afficher une mention déclinant toute responsabilité après une mise en relation suivie d'une transaction hors plateforme.

### Règle 12 — Langage univoque (DOIT / DEVRAIT)

- **DOIT** — Utilisé pour toutes les exigences obligatoires (Must Have et Should Have). Exemple : *Le système DOIT masquer les numéros de téléphone dans la messagerie.*
- **DEVRAIT** — Utilisé pour les options négociables (Could Have). Aucune occurrence dans le périmètre MVP. Exemple d'usage futur : *Le système DEVRAIT proposer un mode hors-ligne en V2.*
- **NE DOIT PAS** — Utilisé pour les interdictions explicites. Exemple : *La plateforme NE DOIT PAS stocker les données bancaires des utilisateurs.*

---

## Phase 6 : Priorisation MoSCoW

### Règle 13 — Catégorisation des exigences

#### M — Must Have (Vital — indispensable à la livraison)

| ID | Libellé |
|---|---|
| BF-01 | Publication d'annonce par le producteur |
| BF-04 | Recherche de produits par catégorie, localité et prix |
| BF-05 | Consultation de fiche produit détaillée |
| BF-06 | Panier et validation de commande |
| BF-08 | Notification de nouvelle commande au vendeur |
| BF-09 | Conversation acheteur-vendeur depuis une annonce |
| BF-10 | Envoi et réception de messages dans la messagerie interne |
| BF-11 | Masquage automatique des numéros et e-mails dans les messages |
| BF-14 | Affichage des produits vedettes sur l'accueil |
| BF-15 | Consultation des cours des semences par localité |
| BF-17 | Choix du mode de paiement (direct ou livraison) |
| BF-18 | Paiement mobile money via YengaPay |
| BF-21 | Configuration du taux de commission par le super-admin |
| BF-22 | Configuration des paramètres YengaPay |
| BF-23 | Validation des badges coopératives par le modérateur |
| BF-25 | Publication des cours des semences par l'admin |
| BF-26 | Inscription en 3 étapes maximum |
| BF-27 | Fourniture du numéro CNIB pour l'inscription vendeur |
| BF-02 | Modification / désactivation d'une annonce |
| BNF-01 à BNF-11 | Toutes les exigences non-fonctionnelles |

#### S — Should Have (Essentiel — tolère un contournement temporaire)

| ID | Libellé |
|---|---|
| BF-03 | Historique des ventes et évaluations pour le producteur |
| BF-07 | Notation et évaluation des vendeurs |
| BF-12 | Notification in-app pour nouveau message |
| BF-13 | Consultation des messages signalés par l'admin |
| BF-19 | Suivi de statut de commande |
| BF-20 | Mise à jour des statuts de livraison par le partenaire logistique |
| BF-24 | Traitement des signalements utilisateurs par le modérateur |
| BF-28 | Photo de certification Bio pour badge vendeur |
| BF-29 | Vérification physique par agent-relais |

#### C — Could Have (Confort — optionnel)

| ID | Libellé |
|---|---|
| — | Aucune fonctionnalité MVP n'est classée Could Have. |

#### W — Won't Have (V2 — exclu du périmètre actuel)

| ID | Libellé |
|---|---|
| BF-30 | Forum communautaire avec thématiques |
| BF-31 | Espace d'apprentissage (articles, fiches pratiques, vidéos) |
| BF-32 | Troc et échange de matériel agricole |
| BF-33 | Location de matériel agricole |
| BF-34 | Pseudonymat forum |
| BF-35 | Application mobile native |
| BF-36 | Interface en langues locales |
| BF-37 | Mode hors-ligne complet |

---

## Phase 7 : Planification, Livrables & Suivi

### Règle 14 — Livrables tangibles et jalons

| Jalon | Livrable | Description |
|---|---|---|
| **J0** | Cahier des Charges validé | Le présent document, signé par le sponsor et l'équipe technique. |
| **J1** | Maquettes validées | Maquettes interactives (Figma) des écrans clés : page d'accueil, fiche produit, panier, messagerie, tableau de bord vendeur. |
| **J2** | MVP — Alpha | Plateforme déployée en environnement de test avec marketplace fonctionnelle + messagerie interne + paiement mobile money (sandbox). |
| **J3** | MVP — Bêta fermée | Plateforme ouverte à un groupe restreint de 5 coopératives partenaires pour test terrain (2 semaines). |
| **J4** | Recette fonctionnelle | Correction des bugs et ajustements issus de la bêta. Validation par le sponsor. |
| **J5** | Mise en production officielle | Déploiement en production. Ouverture au public. |

### Règle 15 — Cadre de validation et de suivi

**Réunions et rapports**
- Les rapports d'avancement sont livrés chaque vendredi à 16h (format : synthèse écrite + indicateurs de vélocité).
- Une réunion de pilotage a lieu toutes les deux semaines, au minimum, avec l'équipe développement et le sponsor.

**Recette**
- Le sponsor dispose de **7 jours ouvrés** après la livraison de chaque jalon pour tester et émettre des objections écrites.
- Passé ce délai, le jalon est considéré comme validé tacitement.
- Chaque objection doit être décrite comme un test reproductible (étapes, résultat attendu, résultat constaté).

**Délais et pénalités**
- Tout dépassement de jalon de plus de 10 % déclenche une réunion de crise dans les 48 heures.
- Aucune pénalité financière n'est appliquée en Phase 1 ; la relation repose sur la confiance et la transparence des reporting.

---

## Annexes

### Annexe A — Glossaire

| Terme | Définition |
|---|---|
| CDC | Cahier des Charges |
| MVP | Minimum Viable Product (produit minimal viable) |
| PWA | Progressive Web Application |
| YengaPay | Agrégateur de paiement mobile money partenaire |
| SIM SONAGESS | Système d'Information sur les Marchés (SONAGESS, Burkina Faso) |
| N'Kalo | Plateforme de données de prix agricoles |
| Mobile money | Paiement par téléphone mobile (Orange Money, Moov Money) |
| Split payment | Répartition automatique du paiement entre vendeur et plateforme |
| CNIB | Carte Nationale d'Identité Burkinabè |
| Agent-relais | Accompagnateur terrain pour l'onboarding et la vérification |

### Annexe B — Références croisées

| Document source | Sections concernées du CDC |
|---|---|
| SmartAgriMarket_Specifications.docx | BF-01 à BF-07, BF-14 à BF-18, BF-23, BF-25, BF-27, BF-29, BNF-05 à BNF-08, CT-04 |
| SmartAgriMarket V2 Document de cadrage.docx | BF-08 à BF-13, BF-19 à BF-22, BF-24, BF-26, BF-28, BNF-01 à BNF-04, BNF-09 à BNF-11, CT-01 à CT-03, CT-05 à CT-08 |
| diagrammes/01-use-case.md | Acteurs et cas d'utilisation |
| diagrammes/02-classes.md | Modèle de données |
| README.md | Présentation générale du projet |

### Annexe C — Architecture technique proposée

| Couche | Technologie | Justification |
|---|---|---|
| Frontend | Angular 18, TypeScript 5.5+, Tailwind CSS | PWA ready, responsive, écosystème mature |
| Backend | Spring Boot 3.x, Java 21 | REST API, JPA/Hibernate, sécurité Spring Security |
| Base de données | PostgreSQL 16 | Relationnelle, fiable, open source |
| Conteneurisation | Docker + Docker Compose | Déploiement reproductible, CI/CD |
| Paiement | YengaPay API | Mobile money (Orange Money, Moov Money), split payment |
| Hébergement | VPS OVH / Scaleway (Afrique de l'Ouest) | Latence minimale pour les utilisateurs burkinabè |
