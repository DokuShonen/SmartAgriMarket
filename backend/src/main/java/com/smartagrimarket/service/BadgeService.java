package com.smartagrimarket.service;

import com.smartagrimarket.dto.BadgeRequest;
import com.smartagrimarket.entity.Badge;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.StatutBadge;
import com.smartagrimarket.entity.enums.TypeBadge;
import com.smartagrimarket.repository.BadgeRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public Badge demanderBadge(UUID utilisateurId, BadgeRequest request) {
        if (badgeRepository.existsByUtilisateurIdAndTypeAndStatut(utilisateurId, request.getType(), StatutBadge.EN_ATTENTE)) {
            throw new RuntimeException("Vous avez déjà une demande en attente pour ce type de badge");
        }
        if (badgeRepository.existsByUtilisateurIdAndTypeAndStatut(utilisateurId, request.getType(), StatutBadge.VALIDE)) {
            throw new RuntimeException("Vous possédez déjà ce badge");
        }

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Badge badge = Badge.builder()
                .utilisateur(utilisateur)
                .type(request.getType())
                .statut(StatutBadge.EN_ATTENTE)
                .documentUrl(request.getDocumentUrl())
                .commentaire(request.getCommentaire())
                .dateDemande(LocalDateTime.now())
                .build();

        return badgeRepository.save(badge);
    }

    @Transactional
    public Badge traiterBadge(UUID badgeId, StatutBadge nouveauStatut, String commentaire, UUID moderateurId) {
        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge introuvable"));

        if (badge.getStatut() != StatutBadge.EN_ATTENTE) {
            throw new RuntimeException("Ce badge a déjà été traité");
        }

        badge.setStatut(nouveauStatut);
        badge.setCommentaire(commentaire);
        badge.setDateTraitement(LocalDateTime.now());

        if (nouveauStatut == StatutBadge.VALIDE) {
            Utilisateur utilisateur = badge.getUtilisateur();
            if (badge.getType() == TypeBadge.BIO) {
                utilisateur.setEstVerifie(true);
                utilisateurRepository.save(utilisateur);
            }
        }

        return badgeRepository.save(badge);
    }

    @Transactional(readOnly = true)
    public List<Badge> getMesBadges(UUID utilisateurId) {
        return badgeRepository.findByUtilisateurIdOrderByDateDemandeDesc(utilisateurId);
    }

    @Transactional(readOnly = true)
    public List<Badge> getBadgesEnAttente() {
        return badgeRepository.findByStatutOrderByDateDemandeDesc(StatutBadge.EN_ATTENTE);
    }

    @Transactional(readOnly = true)
    public List<Badge> getBadgesValides(UUID utilisateurId) {
        return badgeRepository.findByUtilisateurIdOrderByDateDemandeDesc(utilisateurId).stream()
                .filter(b -> b.getStatut() == StatutBadge.VALIDE)
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean aBadgeValide(UUID utilisateurId, TypeBadge type) {
        return badgeRepository.existsByUtilisateurIdAndTypeAndStatut(utilisateurId, type, StatutBadge.VALIDE);
    }
}
