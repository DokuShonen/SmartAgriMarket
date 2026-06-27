export interface ArticleForum {
  id: string;
  titre: string;
  contenu: string;
  categorie: string;
  datePublication: string;
  estModere: boolean;
  auteurNom?: string;
}

export interface ContenuApprentissage {
  id: string;
  titre: string;
  typeContenu: string;
  contenu: string;
  estValide: boolean;
}
