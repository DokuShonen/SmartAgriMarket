# Guide méthodologique : Règles de rédaction d'un Cahier des Charges (CDC)

Ce document rassemble les règles à suivre pour élaborer un cahier des charges robuste, mesurable et inattaquable, sur la base des meilleures pratiques d'ingénierie logicielle.

---

## Phase 1 : Recueil des Besoins & Analyse des Acteurs

- [ ] **Règle 1 : Identifier obligatoirement les 4 familles d'acteurs**
  * **Sponsors :** Qui finance et valide la vision globale du projet ?
  * **Utilisateurs finaux :** Qui va cliquer sur les boutons au quotidien ?
  * **Techniques :** Qui assure la sécurité, l'hébergement et la maintenance ?
  * **Régulateurs :** Quelles entités imposent des lois ou des normes (ex. : CIL, ARCEP) ?

- [ ] **Règle 2 : Arbitrer les priorités avec la Matrice de Mendelow**
  * Classer chaque acteur selon son niveau de *Pouvoir* et d'*Intérêt*.
  * Définir la stratégie de gestion associée : *Gérer étroitement*, *Satisfaire*, *Informer* ou *Surveiller*.

- [ ] **Règle 3 : Pratiquer l'écoute active et les "5 Pourquoi"**
  * Lors des entretiens, poser des questions neutres et ouvertes, utiliser le silence (pause de 3 secondes) et reformuler systématiquement.
  * Appliquer la méthode des *5 Pourquoi* pour remonter jusqu'au besoin systémique réel et éviter de s'arrêter à la demande brute du client.

---

## Phase 2 : Cadrage et Limites du Projet

- [ ] **Règle 4 : Délimiter précisément le périmètre inclus (Le "Quoi")**
  * Lister uniquement les fonctionnalités qui seront développées dans la version actuelle (V1).

- [ ] **Règle 5 : Spécifier explicitement les exclusions (Hors-champ)**
  * Rédiger noir sur blanc ce qui ne sera **pas** fait dans la V1. Cette liste sert de bouclier contractuel contre le gonflement incontrôlé du projet (*Scope Creep*).

---

## Phase 3 : Rédaction des Besoins Fonctionnels (BF)

- [ ] **Règle 6 : Formuler des actions pures**
  * Chaque besoin fonctionnel doit décrire une action concrète que le système exécute en réponse à une interaction.
  * Utiliser la tournure affirmative : *"Le système doit [Action]."*

- [ ] **Règle 7 : Adopter le format standard de User Story**
  * Pour chaque fonctionnalité orientée utilisateur, rédiger sous la forme :
    $$\text{En tant que [Rôle], je veux [Action] afin de [Bénéfice]}$$

---

## Phase 4 : Définition des Besoins Non-Fonctionnels (BNF) & Contraintes

- [ ] **Règle 8 : Structurer les Critères de Qualité (BNF)**
  * **Performance :** Préciser les exigences de vitesse et de réactivité.
  * **Sécurité :** Définir la gestion des accès et de la protection des données (ex. : conformité réglementaire).
  * **Disponibilité :** Spécifier la garantie de service (ex. : fonctionnement 24h/24, résilience aux pannes réseau).

- [ ] **Règle 9 : Documenter les Contraintes du Terrain**
  * Recenser l'environnement technique existant (compatibilité matérielle, OS, APIs existantes à intégrer).
  * Consigner les contraintes externes (règles de conformité légale, normes d'ergonomie et d'accessibilité).

---

## Phase 5 : Rigueur de Rédaction & Filtre SMART

- [ ] **Règle 10 : Éliminer tous les adjectifs flous (Filtre de Mesurabilité)**
  * *Interdiction absolue* d'utiliser des termes subjectifs comme "rapide", "facile", "ergonomique", "sécurisé".
  * *Obligation* de quantifier de manière binaire (testable par Oui ou Non) :
    * *Incorrect :* "L'application doit charger rapidement."
    * *Correct :* "Le temps de chargement du tableau de bord doit être inférieur à 2 secondes sur un réseau 3G."

- [ ] **Règle 11 : Refuser systématiquement l'implicite (Exhaustivité)**
  * Ne jamais supposer que le développeur ou le client partage le même "bon sens".
  * Écrire explicitement tous les comportements attendus (champs obligatoires, formats de validation Regex, processus de confirmation).

- [ ] **Règle 12 : Employer un langage univoque**
  * Utiliser le verbe **"DOIT"** (au présent de l'indicatif) pour exprimer une obligation stricte (*Must Have*).
  * Utiliser le verbe **"DEVRAIT"** (au conditionnel) uniquement pour exprimer une option négociable (*Could Have*).

---

## Phase 6 : Priorisation MoSCoW

- [ ] **Règle 13 : Catégoriser chaque exigence**
  * **M (Must Have - Vital) :** Indispensable pour la livraison. Si cet élément manque, le produit final est considéré comme un échec, inutilisable ou illégal.
  * **S (Should Have - Essentiel) :** Très important, mais tolère un contournement manuel ou temporaire à court terme.
  * **C (Could Have - Confort) :** Optionnel ou cosmétique, traité uniquement s'il reste du temps et du budget.
  * **W (Won't Have - V2) :** Exclu du calendrier de livraison actuel pour sécuriser les délais.

---

## Phase 7 : Planification, Livrables & Suivi

- [ ] **Règle 14 : Exiger des livrables tangibles et des jalons clairs**
  * Ne pas acheter du "temps de développement", mais des livrables physiques à des dates fixes (ex. : Code source sur Git, fichier APK compilé, manuel utilisateur PDF).
  * Structurer le projet autour de jalons de validation successifs (ex. : Jalon 1 : validation maquette $\rightarrow$ Jalon 2 : version bêta $\rightarrow$ Jalon 3 : mise en production officielle).

- [ ] **Règle 15 : Fixer un cadre de validation et de suivi strict**
  * Définir la fréquence des rapports d'avancement (ex. : chaque vendredi à 16h) et les réunions de pilotage.
  * Mettre en place un délai de recette maximal (ex. : le client dispose de 7 jours après la livraison d'un jalon pour émettre des objections, après quoi le jalon est validé tacitement).