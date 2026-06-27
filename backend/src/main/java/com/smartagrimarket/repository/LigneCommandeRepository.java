package com.smartagrimarket.repository;

import com.smartagrimarket.entity.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande, UUID> {
    List<LigneCommande> findByCommandeId(UUID commandeId);
}
