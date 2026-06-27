package com.smartagrimarket.service;

import com.smartagrimarket.entity.ArticleForum;
import com.smartagrimarket.entity.ContenuApprentissage;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.ArticleForumRepository;
import com.smartagrimarket.repository.ContenuApprentissageRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ArticleForumRepository articleForumRepository;
    private final ContenuApprentissageRepository contenuApprentissageRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ArticleForum createArticle(String titre, String contenu, String categorie, UUID auteurId) {
        Utilisateur auteur = utilisateurRepository.findById(auteurId)
                .orElseThrow(() -> new RuntimeException("Auteur introuvable"));

        ArticleForum article = ArticleForum.builder()
                .titre(titre)
                .contenu(contenu)
                .categorie(categorie)
                .auteur(auteur)
                .estModere(false)
                .build();

        return articleForumRepository.save(article);
    }

    public List<ArticleForum> getAllArticles() {
        return articleForumRepository.findAll();
    }

    public List<ArticleForum> getArticlesByCategorie(String categorie) {
        return articleForumRepository.findByCategorie(categorie);
    }

    public ArticleForum modererArticle(UUID id, boolean estModere) {
        ArticleForum article = articleForumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article introuvable"));
        article.setEstModere(estModere);
        return articleForumRepository.save(article);
    }

    public ContenuApprentissage createContenu(String titre, String typeContenu, String contenu) {
        ContenuApprentissage c = ContenuApprentissage.builder()
                .titre(titre)
                .typeContenu(typeContenu)
                .contenu(contenu)
                .estValide(false)
                .build();
        return contenuApprentissageRepository.save(c);
    }

    public List<ContenuApprentissage> getAllContenus() {
        return contenuApprentissageRepository.findAll();
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
}
