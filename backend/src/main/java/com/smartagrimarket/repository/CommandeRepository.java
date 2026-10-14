package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Commande;
import com.smartagrimarket.entity.enums.StatutCommande;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface CommandeRepository extends JpaRepository<Commande, UUID> {
    @EntityGraph(attributePaths = {"acheteur", "producteur", "lignes", "lignes.produit"})
    List<Commande> findByAcheteurIdOrderByDateCreationDesc(UUID acheteurId);

    @EntityGraph(attributePaths = {"acheteur", "producteur", "lignes", "lignes.produit"})
    List<Commande> findByProducteurIdOrderByDateCreationDesc(UUID producteurId);

    @EntityGraph(attributePaths = {"acheteur", "producteur", "lignes", "lignes.produit"})
    List<Commande> findByAcheteurId(UUID acheteurId);

    @EntityGraph(attributePaths = {"acheteur", "producteur", "lignes", "lignes.produit"})
    List<Commande> findByProducteurId(UUID producteurId);

    @EntityGraph(attributePaths = {"acheteur", "producteur", "lignes", "lignes.produit"})
    @Query("SELECT c FROM Commande c")
    List<Commande> findAllWithDetails();

    List<Commande> findByStatut(StatutCommande statut);

    @Query("SELECT c FROM Commande c WHERE c.statut = :statut AND c.dateDerniereModification < :seuil")
    List<Commande> findStaleOrders(@Param("statut") StatutCommande statut, @Param("seuil") LocalDateTime seuil);
}
