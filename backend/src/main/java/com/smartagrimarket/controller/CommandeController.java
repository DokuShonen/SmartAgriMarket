package com.smartagrimarket.controller;

import com.smartagrimarket.dto.CommandeRequest;
import com.smartagrimarket.dto.CommandeResponse;
import com.smartagrimarket.dto.ProduitResponse;
import com.smartagrimarket.entity.enums.StatutCommande;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.CommandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
public class CommandeController {

    private final CommandeService commandeService;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<CommandeResponse> create(@Valid @RequestBody CommandeRequest request) {
        UUID acheteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commandeService.create(acheteurId, request));
    }

    @PostMapping("/{id}/confirmer")
    public ResponseEntity<CommandeResponse> confirmerCommande(@PathVariable UUID id) {
        UUID producteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(commandeService.confirmerCommande(id, producteurId));
    }

    @PostMapping("/{id}/preparer")
    public ResponseEntity<CommandeResponse> preparerCommande(@PathVariable UUID id) {
        UUID producteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(commandeService.preparerCommande(id, producteurId));
    }

    @PostMapping("/{id}/expedier")
    public ResponseEntity<CommandeResponse> expedierCommande(@PathVariable UUID id) {
        UUID producteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(commandeService.expedierCommande(id, producteurId));
    }

    @PostMapping("/{id}/payer")
    public ResponseEntity<CommandeResponse> enregistrerPaiement(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        UUID acheteurId = securityUtil.getCurrentUserId();
        String methode = body.getOrDefault("methode", "PAIEMENT_DIRECT");
        return ResponseEntity.ok(commandeService.enregistrerPaiement(id, acheteurId, methode));
    }

    @GetMapping("/acheteur")
    public ResponseEntity<List<CommandeResponse>> getMesCommandes() {
        UUID acheteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(commandeService.getByAcheteur(acheteurId));
    }

    @GetMapping("/producteur")
    public ResponseEntity<List<CommandeResponse>> getVentes() {
        UUID producteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(commandeService.getByProducteur(producteurId));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<CommandeResponse> updateStatut(
            @PathVariable UUID id,
            @RequestParam StatutCommande statut) {
        securityUtil.checkAdmin();
        return ResponseEntity.ok(commandeService.updateStatut(id, statut));
    }

    @PostMapping("/{id}/confirmer-reception")
    public ResponseEntity<CommandeResponse> confirmerReception(@PathVariable UUID id) {
        UUID acheteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(commandeService.confirmerReception(id, acheteurId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CommandeResponse>> getAll() {
        securityUtil.checkAdmin();
        return ResponseEntity.ok(commandeService.getAll());
    }

    @PostMapping("/{id}/rembourser")
    public ResponseEntity<CommandeResponse> rembourser(@PathVariable UUID id) {
        securityUtil.checkAdmin();
        return ResponseEntity.ok(commandeService.rembourser(id));
    }

    @GetMapping("/{id}/alternatives")
    public ResponseEntity<List<ProduitResponse>> getAlternatives(@PathVariable UUID id) {
        return ResponseEntity.ok(commandeService.trouverAlternatives(id));
    }
}
