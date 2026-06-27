package com.smartagrimarket.repository;

import com.smartagrimarket.entity.SuiviLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SuiviLivraisonRepository extends JpaRepository<SuiviLivraison, UUID> {
    List<SuiviLivraison> findByDemandeLivraisonIdOrderByDateMAJAsc(UUID demandeLivraisonId);
}
