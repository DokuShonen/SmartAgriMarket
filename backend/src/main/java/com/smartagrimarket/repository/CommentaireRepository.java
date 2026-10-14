package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommentaireRepository extends JpaRepository<Commentaire, UUID> {
    List<Commentaire> findByArticleIdAndParentIsNullOrderByDateCreationAsc(UUID articleId);
    List<Commentaire> findByContenuApprentissageIdAndParentIsNullOrderByDateCreationAsc(UUID contenuApprentissageId);
    long countByArticleId(UUID articleId);
    long countByContenuApprentissageId(UUID contenuApprentissageId);
}
