import { Produit } from './produit.model';

export interface ProduitVedette {
  id: string;
  dateDebut: string;
  dateFin: string;
  estActive: boolean;
  produit: Produit;
}
