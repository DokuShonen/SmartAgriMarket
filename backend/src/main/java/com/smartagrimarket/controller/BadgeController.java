package com.smartagrimarket.controller;

import com.smartagrimarket.dto.BadgeRequest;
import com.smartagrimarket.entity.Badge;
import com.smartagrimarket.entity.enums.StatutBadge;
import com.smartagrimarket.entity.enums.TypeBadge;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;
    private final SecurityUtil securityUtil;

    @PostMapping("/demander")
    public ResponseEntity<Badge> demanderBadge(@RequestBody BadgeRequest request) {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(badgeService.demanderBadge(userId, request));
    }

    @GetMapping("/mes-badges")
    public ResponseEntity<List<Badge>> getMesBadges() {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(badgeService.getMesBadges(userId));
    }

    @GetMapping("/en-attente")
    public ResponseEntity<List<Badge>> getBadgesEnAttente() {
        securityUtil.checkAdmin();
        return ResponseEntity.ok(badgeService.getBadgesEnAttente());
    }

    @PatchMapping("/{id}/traiter")
    public ResponseEntity<Badge> traiterBadge(
            @PathVariable UUID id,
            @RequestParam StatutBadge statut,
            @RequestParam(required = false) String commentaire) {
        UUID moderateurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(badgeService.traiterBadge(id, statut, commentaire, moderateurId));
    }

    @GetMapping("/utilisateur/{userId}/verifies")
    public ResponseEntity<List<Badge>> getBadgesUtilisateur(@PathVariable UUID userId) {
        return ResponseEntity.ok(badgeService.getBadgesValides(userId));
    }

    @GetMapping("/verifier/{userId}/{type}")
    public ResponseEntity<Boolean> verifierBadge(@PathVariable UUID userId, @PathVariable TypeBadge type) {
        return ResponseEntity.ok(badgeService.aBadgeValide(userId, type));
    }
}
