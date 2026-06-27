export interface Commande {
  id: string;
  dateCreation: string;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_PREPARATION' | 'EN_COURS_LIVRAISON' | 'LIVREE' | 'ANNULEE';
  montantTotal: number;
  fraisLivraison: number;
  adresseLivraison: string;
  notes: string;
  acheteurId: string;
  acheteurNom: string;
  producteurId: string;
  producteurNom: string;
  lignes: LigneCommande[];
}

export interface LigneCommande {
  produitId: string;
  produitTitre: string;
  quantite: number;
  prixUnitaire: number;
}
