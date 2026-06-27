package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProduitRepository extends JpaRepository<Produit, UUID> {
    List<Produit> findByVendeurId(UUID vendeurId);
    List<Produit> findByCategorieId(UUID categorieId);
    List<Produit> findByLocalite(String localite);

    @Query("""
        SELECT p FROM Produit p
        WHERE (:keyword IS NULL OR LOWER(p.titre) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categorieId IS NULL OR p.categorie.id = :categorieId)
        AND (:localite IS NULL OR p.localite = :localite)
        AND (:prixMin IS NULL OR p.prix >= :prixMin)
        AND (:prixMax IS NULL OR p.prix <= :prixMax)
        ORDER BY p.datePublication DESC
    """)
    Page<Produit> search(
            @Param("keyword") String keyword,
            @Param("categorieId") UUID categorieId,
            @Param("localite") String localite,
            @Param("prixMin") BigDecimal prixMin,
            @Param("prixMax") BigDecimal prixMax,
            Pageable pageable);
}
