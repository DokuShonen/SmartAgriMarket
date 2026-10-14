# Diagramme de Cas d'Utilisation — SmartAgriMarket V2

@startuml
left to right direction
skinparam shadowing false
skinparam monochrome true
skinparam defaultFontName "Arial"
skinparam defaultFontSize 12

left to right direction

actor "Producteur" as P
actor "Agent Relais" as AR
actor "Partenaire Logistique" as Log

rectangle "Marketplace" {
  (Publier annonce produit)
  (Gerer stock)
  (Consulter historique ventes)
  (Evaluer acheteur)
  (Publier annonce materiel)
  (Gerer propositions echange)
  (Envoyer message)
  (Signaler message)
  (Publier contenu forum)
  (Modifier profil)
  (Uploader photo)
}

rectangle "Bourse materiel" {
  (Proposer echange)
  (Acheter materiel)
}

rectangle "Messagerie" {
  (Moderer messages)
}

rectangle "Forum" {
  (Valider contenu pedagogique)
  (Moderer forum)
}

rectangle "Logistique" {
  (Mettre a jour statut course)
  (Confirmer livraison)
}

rectangle "Page accueil" {
  (Rechercher produits)
  (Ajouter au panier)
  (Passer commande)
  (Payer commande)
  (Evaluer vendeur)
  (Demander livraison)
  (Suivre livraison)
  (Consulter produits vedettes)
  (Consulter cours semences)
  (Saisir cours locaux)
  (Gerer cours semences)
  (Gerer produits vedettes)
}

rectangle "Administration" {
  (Valider compte vendeur)
  (Moderer annonces)
  (Gerer prix SONAGESS)
  (Gerer utilisateurs)
  (Gerer signalements)
  (Consulter tableau de bord)
}

actor "Acheteur" as A
actor "Administrateur" as Admin

P --> (Publier annonce produit)
P --> (Gerer stock)
P --> (Consulter historique ventes)
P --> (Evaluer acheteur)
P --> (Publier annonce materiel)
P --> (Gerer propositions echange)
P --> (Envoyer message)
P --> (Signaler message)
P --> (Publier contenu forum)
P --> (Modifier profil)
P --> (Uploader photo)

AR --> (Saisir cours locaux)

Log --> (Mettre a jour statut course)
Log --> (Confirmer livraison)

A --> (Rechercher produits)
A --> (Ajouter au panier)
A --> (Passer commande)
A --> (Payer commande)
A --> (Evaluer vendeur)
A --> (Proposer echange)
A --> (Acheter materiel)
A --> (Envoyer message)
A --> (Signaler message)
A --> (Publier contenu forum)
A --> (Demander livraison)
A --> (Suivre livraison)
A --> (Consulter produits vedettes)
A --> (Consulter cours semences)
A --> (Modifier profil)
A --> (Uploader photo)

Admin --> (Valider compte vendeur)
Admin --> (Moderer annonces)
Admin --> (Gerer produits vedettes)
Admin --> (Moderer messages)
Admin --> (Valider contenu pedagogique)
Admin --> (Moderer forum)
Admin --> (Gerer cours semences)
Admin --> (Gerer prix SONAGESS)
Admin --> (Gerer utilisateurs)
Admin --> (Gerer signalements)
Admin --> (Consulter tableau de bord)

@enduml
