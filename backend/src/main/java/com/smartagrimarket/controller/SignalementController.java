package com.smartagrimarket.controller;

import com.smartagrimarket.dto.SignalementResponse;
import com.smartagrimarket.entity.*;
import com.smartagrimarket.repository.*;
import com.smartagrimarket.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/signalements")
@RequiredArgsConstructor
public class SignalementController {

    private final SignalementRepository signalementRepository;
    private final SecurityUtil securityUtil;
    private final ProduitRepository produitRepository;
    private final ArticleForumRepository articleForumRepository;
    private final ContenuApprentissageRepository contenuApprentissageRepository;
    private final AnnonceMaterielRepository annonceMaterielRepository;
    private final UtilisateurRepository utilisateurRepository;

    @PostMapping
    public ResponseEntity<Signalement> signaler(@RequestBody Map<String, String> body) {
        UUID auteurId = securityUtil.getCurrentUserId();
        Signalement s = Signalement.builder()
                .typeCible(body.get("typeCible"))
                .cibleId(UUID.fromString(body.get("cibleId")))
                .motif(body.get("motif"))
                .statut("EN_ATTENTE")
                .auteur(securityUtil.getCurrentUser())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(signalementRepository.save(s));
    }

    @GetMapping
    public ResponseEntity<List<SignalementResponse>> getAll() {
        securityUtil.checkModerationSupport();
        List<SignalementResponse> responses = signalementRepository.findAllByOrderByDateCreationDesc()
                .stream()
                .map(s -> SignalementResponse.from(s, resolveCibleNom(s)))
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Signalement> updateStatut(@PathVariable UUID id, @RequestParam String statut) {
        securityUtil.checkModerationSupport();
        Signalement s = signalementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Signalement introuvable"));
        s.setStatut(statut);
        return ResponseEntity.ok(signalementRepository.save(s));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        securityUtil.checkModerationSupport();
        return ResponseEntity.ok(Map.of(
            "enAttente", signalementRepository.countByStatut("EN_ATTENTE"),
            "resolu", signalementRepository.countByStatut("RESOLU"),
            "rejete", signalementRepository.countByStatut("REJETE")
        ));
    }

    private String resolveCibleNom(Signalement s) {
        try {
            return switch (s.getTypeCible()) {
                case "PRODUIT" -> produitRepository.findById(s.getCibleId())
                        .map(Produit::getTitre).orElse("Produit introuvable");
                case "MESSAGE" -> "Message";
                case "UTILISATEUR", "USER" -> utilisateurRepository.findById(s.getCibleId())
                        .map(u -> u.getPrenom() + " " + u.getNom()).orElse("Utilisateur introuvable");
                case "ARTICLE_FORUM", "ARTICLE" -> articleForumRepository.findById(s.getCibleId())
                        .map(ArticleForum::getTitre).orElse("Article introuvable");
                case "CONTENU_APPRENTISSAGE", "COURS" -> contenuApprentissageRepository.findById(s.getCibleId())
                        .map(ContenuApprentissage::getTitre).orElse("Cours introuvable");
                case "ANNONCE_MATERIEL", "ANNONCE" -> annonceMaterielRepository.findById(s.getCibleId())
                        .map(AnnonceMateriel::getTitre).orElse("Annonce introuvable");
                default -> s.getTypeCible();
            };
        } catch (Exception e) {
            return s.getTypeCible();
        }
    }
}
