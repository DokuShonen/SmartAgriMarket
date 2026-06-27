export interface Produit {
  id: string;
  titre: string;
  description: string;
  prix: number;
  uniteVente: string;
  quantiteDisponible: number;
  categorie: string;
  localite: string;
  photos: string[];
  datePublication: string;
  conditionsLivraison: string;
  vendeurId: string;
  vendeurNom: string;
}
