package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Commentaire;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class CommentaireResponse {
    private UUID id;
    private String contenu;
    private int likes;
    private LocalDateTime dateCreation;
    private UUID auteurId;
    private String auteurNom;
    private String auteurPhoto;
    private UUID parentId;
    private UUID articleId;
    private String articleTitre;
    private UUID contenuApprentissageId;
    private String contenuApprentissageTitre;
    private List<CommentaireResponse> reponses;
    private boolean liked;

    private static CommentaireResponse fromBase(Commentaire c, UUID currentUserId) {
        CommentaireResponse r = new CommentaireResponse();
        r.id = c.getId();
        r.contenu = c.getContenu();
        r.likes = c.getLikes();
        r.dateCreation = c.getDateCreation();
        if (c.getAuteur() != null) {
            r.auteurId = c.getAuteur().getId();
            String pseudo = c.getAuteur().getPseudoForum();
            r.auteurNom = (pseudo != null && !pseudo.isBlank()) ? pseudo : c.getAuteur().getPrenom() + " " + c.getAuteur().getNom();
            r.auteurPhoto = c.getAuteur().getPhotoProfil();
        }
        if (c.getParent() != null) {
            r.parentId = c.getParent().getId();
        }
        if (c.getArticle() != null) {
            r.articleId = c.getArticle().getId();
            r.articleTitre = c.getArticle().getTitre();
        }
        if (c.getContenuApprentissage() != null) {
            r.contenuApprentissageId = c.getContenuApprentissage().getId();
            r.contenuApprentissageTitre = c.getContenuApprentissage().getTitre();
        }
        r.liked = currentUserId != null && c.getLikedPar() != null &&
                c.getLikedPar().stream().anyMatch(u -> u.getId().equals(currentUserId));
        return r;
    }

    public static CommentaireResponse from(Commentaire c, UUID currentUserId) {
        CommentaireResponse r = fromBase(c, currentUserId);
        if (c.getReponses() != null) {
            r.reponses = c.getReponses().stream()
                    .map(reponse -> CommentaireResponse.from(reponse, currentUserId))
                    .toList();
        } else {
            r.reponses = new ArrayList<>();
        }
        return r;
    }

    public static CommentaireResponse fromFlat(Commentaire c, UUID currentUserId) {
        return fromBase(c, currentUserId);
    }
}
