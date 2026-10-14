export interface ArticleForum {
  id: string;
  titre: string;
  contenu: string;
  categorie: string;
  datePublication: string;
  estModere: boolean;
  auteur?: {
    id: string;
    prenom: string;
    nom: string;
    pseudoForum?: string;
    photoProfil?: string;
  };
}

export interface ContenuApprentissage {
  id: string;
  titre: string;
  typeContenu: string;
  contenu: string;
  estValide: boolean;
  validePar?: {
    id: string;
    prenom: string;
    nom: string;
  };
}
