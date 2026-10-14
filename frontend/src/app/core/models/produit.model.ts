export interface Produit {
  id: string;
  titre: string;
  description: string;
  prix: number;
  uniteVente: string;
  quantiteDisponible: number;
  categorieId: string;
  categorie: string;
  localite: string;
  photos: string[];
  datePublication: string;
  conditionsLivraison: string;
  dateRecolte?: string;
  ficheTechnique?: string;
  vendeurId: string;
  vendeurNom: string;
  vendeurEstVerifie: boolean;
  estActif: boolean;
}
