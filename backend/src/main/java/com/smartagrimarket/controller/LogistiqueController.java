package com.smartagrimarket.controller;

import com.smartagrimarket.dto.DemandeLivraisonRequest;
import com.smartagrimarket.entity.DemandeLivraison;
import com.smartagrimarket.entity.SuiviLivraison;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.LogistiqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/logistique")
@RequiredArgsConstructor
public class LogistiqueController {

    private final LogistiqueService logistiqueService;
    private final SecurityUtil securityUtil;

    @PostMapping("/demandes/{commandeId}")
    public ResponseEntity<DemandeLivraison> createDemande(
            @PathVariable UUID commandeId,
            @Valid @RequestBody DemandeLivraisonRequest request) {
        UUID acheteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(logistiqueService.create(commandeId, acheteurId, request));
    }

    @PostMapping("/demandes/{demandeId}/prise-en-charge")
    public ResponseEntity<DemandeLivraison> prendreEnCharge(@PathVariable UUID demandeId) {
        UUID partenaireId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(logistiqueService.prendreEnCharge(demandeId, partenaireId));
    }

    @PostMapping("/demandes/{demandeId}/confirmer-livraison")
    public ResponseEntity<DemandeLivraison> confirmerLivraison(@PathVariable UUID demandeId) {
        return ResponseEntity.ok(logistiqueService.confirmerLivraison(demandeId));
    }

    @GetMapping("/demandes/{demandeId}/suivi")
    public ResponseEntity<List<SuiviLivraison>> getSuivi(@PathVariable UUID demandeId) {
        return ResponseEntity.ok(logistiqueService.getSuivi(demandeId));
    }
}
