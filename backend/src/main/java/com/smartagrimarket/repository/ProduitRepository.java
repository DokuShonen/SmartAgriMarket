package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProduitRepository extends JpaRepository<Produit, UUID> {
    @EntityGraph(attributePaths = {"categorie", "vendeur"})
    List<Produit> findByVendeurId(UUID vendeurId);

    @EntityGraph(attributePaths = {"categorie", "vendeur"})
    List<Produit> findByVendeurIdAndEstActifTrue(UUID vendeurId);
    List<Produit> findByCategorieId(UUID categorieId);
    List<Produit> findByLocalite(String localite);

    @Query(value = """
        SELECT p.* FROM produits p
        LEFT JOIN categories c ON p.categorie_id = c.id
        WHERE p.est_actif = true
        AND (:keyword IS NULL OR LOWER(p.titre::text) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description::text) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categorieId IS NULL OR p.categorie_id = :categorieId)
        AND (:localite IS NULL OR p.localite = :localite)
        AND (:prixMin IS NULL OR p.prix >= :prixMin)
        AND (:prixMax IS NULL OR p.prix <= :prixMax)
        ORDER BY p.date_publication DESC
    """, countQuery = """
        SELECT COUNT(*) FROM produits p
        WHERE p.est_actif = true
        AND (:keyword IS NULL OR LOWER(p.titre::text) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description::text) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categorieId IS NULL OR p.categorie_id = :categorieId)
        AND (:localite IS NULL OR p.localite = :localite)
        AND (:prixMin IS NULL OR p.prix >= :prixMin)
        AND (:prixMax IS NULL OR p.prix <= :prixMax)
    """, nativeQuery = true)
    Page<Produit> search(
            @Param("keyword") String keyword,
            @Param("categorieId") UUID categorieId,
            @Param("localite") String localite,
            @Param("prixMin") BigDecimal prixMin,
            @Param("prixMax") BigDecimal prixMax,
            Pageable pageable);

    @Query(value = """
        SELECT p.* FROM produits p
        LEFT JOIN categories c ON p.categorie_id = c.id
        WHERE (:keyword IS NULL OR LOWER(p.titre::text) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description::text) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categorieId IS NULL OR p.categorie_id = :categorieId)
        AND (:localite IS NULL OR p.localite = :localite)
        AND (:prixMin IS NULL OR p.prix >= :prixMin)
        AND (:prixMax IS NULL OR p.prix <= :prixMax)
        ORDER BY p.date_publication DESC
    """, countQuery = """
        SELECT COUNT(*) FROM produits p
        WHERE (:keyword IS NULL OR LOWER(p.titre::text) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description::text) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categorieId IS NULL OR p.categorie_id = :categorieId)
        AND (:localite IS NULL OR p.localite = :localite)
        AND (:prixMin IS NULL OR p.prix >= :prixMin)
        AND (:prixMax IS NULL OR p.prix <= :prixMax)
    """, nativeQuery = true)
    Page<Produit> searchAll(
            @Param("keyword") String keyword,
            @Param("categorieId") UUID categorieId,
            @Param("localite") String localite,
            @Param("prixMin") BigDecimal prixMin,
            @Param("prixMax") BigDecimal prixMax,
            Pageable pageable);
}
