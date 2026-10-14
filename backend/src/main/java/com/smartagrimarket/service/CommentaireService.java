package com.smartagrimarket.service;

import com.smartagrimarket.dto.CommentaireRequest;
import com.smartagrimarket.dto.CommentaireResponse;
import com.smartagrimarket.entity.ArticleForum;
import com.smartagrimarket.entity.Commentaire;
import com.smartagrimarket.entity.ContenuApprentissage;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.ArticleForumRepository;
import com.smartagrimarket.repository.CommentaireRepository;
import com.smartagrimarket.repository.ContenuApprentissageRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentaireService {

    private final CommentaireRepository commentaireRepository;
    private final ArticleForumRepository articleRepository;
    private final ContenuApprentissageRepository contenuApprentissageRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public CommentaireResponse creer(UUID auteurId, CommentaireRequest request) {
        Utilisateur auteur = utilisateurRepository.findById(auteurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String contenuFiltre = ContactFilterService.filterCoordonnees(request.getContenu());
        boolean aEteFiltre = !contenuFiltre.equals(request.getContenu());

        Commentaire.CommentaireBuilder builder = Commentaire.builder()
                .contenu(request.getContenu())
                .auteur(auteur);

        if (aEteFiltre) {
            auteur.setViolationsCount(auteur.getViolationsCount() + 1);
            if (auteur.getViolationsCount() >= 3) {
                auteur.setEstSuspendu(true);
            }
            utilisateurRepository.save(auteur);
        }

        if (request.getArticleId() != null) {
            ArticleForum article = articleRepository.findById(request.getArticleId())
                    .orElseThrow(() -> new RuntimeException("Article introuvable"));
            builder.article(article);
        } else if (request.getContenuApprentissageId() != null) {
            ContenuApprentissage contenu = contenuApprentissageRepository
                    .findById(request.getContenuApprentissageId())
                    .orElseThrow(() -> new RuntimeException("Contenu d'apprentissage introuvable"));
            builder.contenuApprentissage(contenu);
        } else {
            throw new RuntimeException("articleId ou contenuApprentissageId requis");
        }

        if (request.getParentId() != null) {
            Commentaire parent = commentaireRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Commentaire parent introuvable"));
            builder.parent(parent);
        }

        Commentaire commentaire = builder.build();
        return CommentaireResponse.from(commentaireRepository.save(commentaire), auteurId);
    }

    @Transactional(readOnly = true)
    public List<CommentaireResponse> getParArticle(UUID articleId, UUID currentUserId) {
        return commentaireRepository.findByArticleIdAndParentIsNullOrderByDateCreationAsc(articleId).stream()
                .map(c -> CommentaireResponse.from(c, currentUserId))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CommentaireResponse> getParApprentissage(UUID contenuApprentissageId, UUID currentUserId) {
        return commentaireRepository.findByContenuApprentissageIdAndParentIsNullOrderByDateCreationAsc(contenuApprentissageId).stream()
                .map(c -> CommentaireResponse.from(c, currentUserId))
                .toList();
    }

    @Transactional
    public CommentaireResponse toggleLike(UUID commentaireId, UUID userId) {
        Commentaire commentaire = commentaireRepository.findById(commentaireId)
                .orElseThrow(() -> new RuntimeException("Commentaire introuvable"));
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (commentaire.getLikedPar().contains(user)) {
            commentaire.getLikedPar().remove(user);
            commentaire.setLikes(commentaire.getLikes() - 1);
        } else {
            commentaire.getLikedPar().add(user);
            commentaire.setLikes(commentaire.getLikes() + 1);
        }

        return CommentaireResponse.from(commentaireRepository.save(commentaire), userId);
    }

    @Transactional(readOnly = true)
    public long countParArticle(UUID articleId) {
        return commentaireRepository.countByArticleId(articleId);
    }

    @Transactional(readOnly = true)
    public long countParApprentissage(UUID contenuApprentissageId) {
        return commentaireRepository.countByContenuApprentissageId(contenuApprentissageId);
    }

    @Transactional(readOnly = true)
    public List<CommentaireResponse> getAllCommentaires() {
        return commentaireRepository.findAll().stream()
                .map(c -> CommentaireResponse.fromFlat(c, null))
                .toList();
    }
}
