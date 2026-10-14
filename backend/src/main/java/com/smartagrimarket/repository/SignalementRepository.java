package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Signalement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SignalementRepository extends JpaRepository<Signalement, UUID> {
    List<Signalement> findAllByOrderByDateCreationDesc();
    List<Signalement> findByStatutOrderByDateCreationDesc(String statut);
    long countByStatut(String statut);
}
