export interface AnnonceMateriel {
  id: string;
  titre: string;
  description: string;
  prix: number;
  etat: 'NEUF' | 'OCCASION';
  typeTransaction: 'VENTE' | 'LOCATION';
  photos: string[];
  localite: string;
  vendeurId: string;
  vendeurNom: string;
  duree?: string;
  caution?: number;
  disponibilites?: string;
}
