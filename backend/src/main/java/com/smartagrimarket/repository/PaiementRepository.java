package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PaiementRepository extends JpaRepository<Paiement, UUID> {
    Optional<Paiement> findByCommandeId(UUID commandeId);
    Optional<Paiement> findByReference(String reference);
}
