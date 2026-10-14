package com.smartagrimarket.repository;

import com.smartagrimarket.entity.ArticleForum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ArticleForumRepository extends JpaRepository<ArticleForum, UUID> {
    List<ArticleForum> findByCategorie(String categorie);
    List<ArticleForum> findByAuteurId(UUID auteurId);
    List<ArticleForum> findByEstModere(boolean estModere);

    @Query("SELECT a FROM ArticleForum a WHERE LOWER(a.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.contenu) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ArticleForum> rechercher(@Param("keyword") String keyword);
}
