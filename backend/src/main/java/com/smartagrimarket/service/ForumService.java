package com.smartagrimarket.service;

import com.smartagrimarket.entity.ArticleForum;
import com.smartagrimarket.entity.ContenuApprentissage;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.ArticleForumRepository;
import com.smartagrimarket.repository.ContenuApprentissageRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ArticleForumRepository articleForumRepository;
    private final ContenuApprentissageRepository contenuApprentissageRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    public ArticleForum createArticle(String titre, String contenu, String categorie, UUID auteurId) {
        Utilisateur auteur = utilisateurRepository.findById(auteurId)
                .orElseThrow(() -> new RuntimeException("Auteur introuvable"));

        String contenuFiltre = ContactFilterService.filterCoordonnees(contenu);
        boolean aEteFiltre = !contenuFiltre.equals(contenu);

        ArticleForum article = ArticleForum.builder()
                .titre(titre)
                .contenu(contenu)
                .categorie(categorie)
                .auteur(auteur)
                .estModere(false)
                .build();

        ArticleForum saved = articleForumRepository.save(article);

        if (aEteFiltre) {
            auteur.setViolationsCount(auteur.getViolationsCount() + 1);
            if (auteur.getViolationsCount() >= 3) {
                auteur.setEstSuspendu(true);
            }
            utilisateurRepository.save(auteur);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<ArticleForum> getAllArticles() {
        return articleForumRepository.findAll().stream()
                .sorted(Comparator.comparing(ArticleForum::getDatePublication).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ArticleForum> rechercherArticles(String keyword) {
        return articleForumRepository.rechercher(keyword).stream()
                .sorted(Comparator.comparing(ArticleForum::getDatePublication).reversed())
                .toList();
    }

    public ArticleForum modererArticle(UUID id, boolean estModere) {
        ArticleForum article = articleForumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article introuvable"));
        article.setEstModere(estModere);
        ArticleForum saved = articleForumRepository.save(article);

        try {
            String statut = estModere ? "approuvé" : "signalé";
            notificationService.creer(article.getAuteur().getId(), "Article " + statut,
                    "Votre article \"" + article.getTitre() + "\" a été " + statut + " par un modérateur",
                    "MODERATION", "/forum");
        } catch (Exception e) {
            System.err.println("Erreur notification modération: " + e.getMessage());
        }

        return saved;
    }

    public void supprimerArticle(UUID id) {
        if (!articleForumRepository.existsById(id)) {
            throw new RuntimeException("Article introuvable");
        }
        articleForumRepository.deleteById(id);
    }

    public ContenuApprentissage createContenu(String titre, String typeContenu, String contenu, UUID auteurId) {
        Utilisateur auteur = auteurId != null ? utilisateurRepository.findById(auteurId).orElse(null) : null;
        ContenuApprentissage c = ContenuApprentissage.builder()
                .titre(titre)
                .typeContenu(typeContenu)
                .contenu(contenu)
                .estValide(false)
                .auteur(auteur)
                .build();
        return contenuApprentissageRepository.save(c);
    }

    @Transactional(readOnly = true)
    public List<ContenuApprentissage> getAllContenus() {
        return contenuApprentissageRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ContenuApprentissage getContenuById(UUID id) {
        return contenuApprentissageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contenu d'apprentissage introuvable"));
    }

    public ContenuApprentissage validerContenu(UUID id, UUID valideParId) {
        ContenuApprentissage c = contenuApprentissageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contenu introuvable"));
        Utilisateur validePar = utilisateurRepository.findById(valideParId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        c.setEstValide(true);
        c.setValidePar(validePar);
        return contenuApprentissageRepository.save(c);
    }

    public void deleteContenu(UUID id) {
        contenuApprentissageRepository.deleteById(id);
    }
}
