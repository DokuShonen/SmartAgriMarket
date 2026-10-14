# Diagramme de Classes — SmartAgriMarket V2

```plantuml
@startuml

enum StatutCommande {
  EN_ATTENTE
  CONFIRMEE
  EN_PREPARATION
  EN_COURS_LIVRAISON
  LIVREE
  ANNULEE
}

enum TypeTransaction {
  VENTE
  ECHANGE
}

enum EtatMateriel {
  NEUF
  OCCASION
}

enum TypeUtilisateur {
  PRODUCTEUR
  ACHETEUR
  ADMIN
  SUPER_ADMIN
  LOGISTIQUE
  AGENT_RELAIS
  MODERATION_SUPPORT
  MODERATION_FORUM
  ADMIN_TECHNIQUE
}

class Utilisateur {
  +id: UUID
  +nom: String
  +prenom: String
  +email: String
  +telephone: String
  +motDePasse: String
  +localite: String
  +type: TypeUtilisateur
  +dateInscription: DateTime
  +estVerifie: Boolean
  +estSuspendu: Boolean
  +violationsCount: Int
  +pseudoForum: String
  +cnib: String
  +cooperative: String
  +photoCertificationBio: String
  +photoProfil: String
}

class Producteur {
  +noteMoyenne: Float
  +nombreVentes: Int
}

class Acheteur {
}

class Administrateur {
}

class SuperAdmin {
}

class PartenaireLogistique {
  +zoneCouverture: String
}

class AgentRelais {
}

class Produit {
  +id: UUID
  +titre: String
  +description: String
  +prix: BigDecimal
  +uniteVente: String
  +quantiteDisponible: Int
  +categorie: Categorie
  +localite: String
  +photos: List<String>
  +datePublication: DateTime
  +conditionsLivraison: String
  +estActif: Boolean
  +vendeur: Utilisateur
}

class Categorie {
  +id: UUID
  +nom: String
  +description: String
  +imageUrl: String
  +parent: Categorie
}

class AnnonceMateriel {
  +id: UUID
  +titre: String
  +description: String
  +prix: BigDecimal
  +etat: EtatMateriel
  +typeTransaction: TypeTransaction
  +photos: List<String>
  +localite: String
  +estActive: Boolean
  +datePublication: DateTime
  +vendeur: Utilisateur
}

class PropositionEchange {
  +id: UUID
  +message: String
  +statut: String
  +dateCreation: DateTime
  +annonceMateriel: AnnonceMateriel
  +proposant: Utilisateur
}

class Commande {
  +id: UUID
  +dateCreation: DateTime
  +statut: StatutCommande
  +montantTotal: BigDecimal
  +fraisLivraison: BigDecimal
  +adresseLivraison: String
  +notes: String
  +acheteur: Utilisateur
  +producteur: Utilisateur
}

class LigneCommande {
  +quantite: Int
  +prixUnitaire: BigDecimal
  +produit: Produit
}

class Paiement {
  +id: UUID
  +montant: BigDecimal
  +methode: String
  +reference: String
  +statut: String
  +datePaiement: DateTime
  +commande: Commande
}

class Evaluation {
  +id: UUID
  +note: Int
  +commentaire: String
  +dateCreation: DateTime
  +donneur: Utilisateur
  +receveur: Utilisateur
}

class Conversation {
  +id: UUID
  +dateDebut: DateTime
  +estActive: Boolean
  +participants: List<Utilisateur>
}

class Message {
  +id: UUID
  +contenu: String
  +contenuFiltre: String
  +dateEnvoi: DateTime
  +estLu: Boolean
  +expediteur: Utilisateur
  +conversation: Conversation
}

class DemandeLivraison {
  +id: UUID
  +adresseDepart: String
  +adresseArrivee: String
  +distanceKm: Float
  +frais: BigDecimal
  +statut: String
  +datePriseEnCharge: DateTime
  +dateCreation: DateTime
  +commande: Commande
  +partenaire: Utilisateur
}

class SuiviLivraison {
  +id: UUID
  +statut: String
  +localisation: String
  +dateMAJ: DateTime
  +demandeLivraison: DemandeLivraison
}

class ArticleForum {
  +id: UUID
  +titre: String
  +contenu: String
  +categorie: String
  +datePublication: DateTime
  +estModere: Boolean
  +auteur: Utilisateur
}

class Commentaire {
  +id: UUID
  +contenu: String
  +likes: Int
  +dateCreation: DateTime
  +auteur: Utilisateur
  +article: ArticleForum
  +contenuApprentissage: ContenuApprentissage
  +parent: Commentaire
  +reponses: List<Commentaire>
  +likedPar: List<Utilisateur>
}

class ContenuApprentissage {
  +id: UUID
  +titre: String
  +typeContenu: String
  +contenu: String
  +estValide: Boolean
  +auteur: Utilisateur
}

class CoursSemence {
  +id: UUID
  +produit: String
  +prix: BigDecimal
  +localite: String
  +dateMAJ: DateTime
  +source: String
}

class PrixSonagess {
  +id: UUID
  +produit: String
  +categorie: String
  +prix: BigDecimal
  +unite: String
  +dateMAJ: DateTime
}

class ProduitVedette {
  +id: UUID
  +dateDebut: DateTime
  +dateFin: DateTime
  +estActive: Boolean
  +produit: Produit
}

class Signalement {
  +id: UUID
  +cibleId: UUID
  +type: String
  +motif: String
  +dateCreation: DateTime
  +auteur: Utilisateur
}

class Notification {
  +id: UUID
  +type: String
  +message: String
  +estLu: Boolean
  +dateCreation: DateTime
  +referenceId: UUID
  +destinataire: Utilisateur
}

' --- Héritage utilisateurs ---

Utilisateur <|-- Producteur
Utilisateur <|-- Acheteur
Utilisateur <|-- Administrateur
Utilisateur <|-- SuperAdmin
Utilisateur <|-- PartenaireLogistique
Utilisateur <|-- AgentRelais

' --- Associations ---

Producteur "1" -- "*" Produit : publie
Acheteur "1" -- "*" Commande : passe
Producteur "1" -- "*" Commande : recoit
Commande "1" -- "*" LigneCommande : contient
Produit "1" -- "*" LigneCommande
Commande "1" -- "1" Paiement
Produit "*" -- "1" Categorie

Producteur "1" -- "*" AnnonceMateriel : publie
AnnonceMateriel "1" -- "*" PropositionEchange : recoit
Utilisateur "1" -- "*" PropositionEchange : propose

Utilisateur "1" -- "*" Evaluation : donne
Utilisateur "1" -- "*" Evaluation : recoit

Conversation "1" -- "*" Message
Utilisateur "*" -- "*" Conversation : participe

Commande "1" -- "1" DemandeLivraison
DemandeLivraison "1" -- "*" SuiviLivraison
PartenaireLogistique "1" -- "*" DemandeLivraison : prend en charge

Utilisateur "1" -- "*" ArticleForum : publie
ArticleForum "1" -- "*" Commentaire : contient
Commentaire "1" -- "*" Commentaire : reponse
Utilisateur "*" -- "*" Commentaire : like
Administrateur "1" -- "*" ContenuApprentissage : valide

ProduitVedette "*" -- "1" Produit

Utilisateur "1" -- "*" Signalement : signale
Utilisateur "1" -- "*" Notification : recoit

AgentRelais "1" -- "*" CoursSemence : saisit

Administrateur "1" -- "*" PrixSonagess : gere

@enduml
```
