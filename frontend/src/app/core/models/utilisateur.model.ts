export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  localite: string;
  type: 'PRODUCTEUR' | 'ACHETEUR' | 'ADMIN' | 'LOGISTIQUE' | 'AGENT_RELAIS';
  dateInscription: string;
  estVerifie: boolean;
}
