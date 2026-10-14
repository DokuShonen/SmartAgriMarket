package com.smartagrimarket.repository;

import com.smartagrimarket.entity.Badge;
import com.smartagrimarket.entity.enums.StatutBadge;
import com.smartagrimarket.entity.enums.TypeBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BadgeRepository extends JpaRepository<Badge, UUID> {
    List<Badge> findByUtilisateurIdOrderByDateDemandeDesc(UUID utilisateurId);
    List<Badge> findByStatutOrderByDateDemandeDesc(StatutBadge statut);
    List<Badge> findAllByOrderByDateDemandeDesc();
    Optional<Badge> findByUtilisateurIdAndTypeAndStatut(UUID utilisateurId, TypeBadge type, StatutBadge statut);
    boolean existsByUtilisateurIdAndTypeAndStatut(UUID utilisateurId, TypeBadge type, StatutBadge statut);
}
