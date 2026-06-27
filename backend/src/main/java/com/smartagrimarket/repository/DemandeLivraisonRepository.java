package com.smartagrimarket.repository;

import com.smartagrimarket.entity.DemandeLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface DemandeLivraisonRepository extends JpaRepository<DemandeLivraison, UUID> {
    Optional<DemandeLivraison> findByCommandeId(UUID commandeId);
}
