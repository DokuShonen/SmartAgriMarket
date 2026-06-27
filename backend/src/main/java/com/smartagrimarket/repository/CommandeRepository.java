package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Commande;
import com.smartagrimarket.entity.enums.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommandeRepository extends JpaRepository<Commande, UUID> {
    List<Commande> findByAcheteurId(UUID acheteurId);
    List<Commande> findByProducteurId(UUID producteurId);
    List<Commande> findByStatut(StatutCommande statut);
}
