export interface DemandeLivraison {
  id: string;
  adresseDepart: string;
  adresseArrivee: string;
  distanceKm?: number;
  frais?: number;
  statut: string;
  datePriseEnCharge?: string;
  commandeId: string;
  partenaireNom?: string;
}

export interface SuiviLivraison {
  id: string;
  statut: string;
  localisation?: string;
  dateMAJ: string;
}
