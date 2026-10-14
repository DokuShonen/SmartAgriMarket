export interface Conversation {
  id: string;
  dateDebut: string;
  estActive: boolean;
  participants: string[];
  participantsPhotos?: string[];
  messages: Message[];
}

export interface Message {
  id: string;
  contenu: string;
  contenuFiltre: string;
  dateEnvoi: string;
  estLu: boolean;
  expediteurId: string;
  expediteurNom: string;
  expediteurPhoto?: string;
}
