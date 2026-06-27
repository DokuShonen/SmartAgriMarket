export interface AnnonceMateriel {
  id: string;
  titre: string;
  description: string;
  prix: number;
  etat: 'NEUF' | 'OCCASION';
  typeTransaction: 'VENTE' | 'ECHANGE';
  photos: string[];
  localite: string;
  vendeurId: string;
  vendeurNom: string;
}
