package com.smartagrimarket.repository;

import com.smartagrimarket.entity.ArticleForum;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ArticleForumRepository extends JpaRepository<ArticleForum, UUID> {
    List<ArticleForum> findByCategorie(String categorie);
    List<ArticleForum> findByAuteurId(UUID auteurId);
    List<ArticleForum> findByEstModere(boolean estModere);
}
