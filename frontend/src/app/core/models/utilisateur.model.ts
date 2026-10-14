export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse?: string;
  localite: string;
  photoProfil?: string;
  photoCertificationBio?: string;
  type: 'PRODUCTEUR' | 'ACHETEUR' | 'LOGISTIQUE' | 'AGENT_RELAIS' | 'ADMIN' | 'MODERATION_SUPPORT' | 'MODERATION_FORUM' | 'ADMIN_TECHNIQUE' | 'SUPER_ADMIN';
  estVerifie: boolean;
  pseudoForum?: string;
  violationsCount: number;
  estSuspendu: boolean;
  cooperative?: string;
  dateInscription?: string;
}
