package com.smartagrimarket.repository;

import com.smartagrimarket.entity.DemandeLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DemandeLivraisonRepository extends JpaRepository<DemandeLivraison, UUID> {
    Optional<DemandeLivraison> findByCommandeId(UUID commandeId);

    @Query("SELECT d FROM DemandeLivraison d WHERE d.commande.acheteur.id = :userId OR d.partenaire.id = :userId")
    List<DemandeLivraison> findByUserId(@Param("userId") UUID userId);

    List<DemandeLivraison> findByStatut(String statut);
}
