package com.smartagrimarket.controller;

import com.smartagrimarket.dto.CommandeRequest;
import com.smartagrimarket.dto.CommandeResponse;
import com.smartagrimarket.entity.enums.StatutCommande;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.CommandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
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
        return ResponseEntity.ok(commandeService.updateStatut(id, statut));
    }
}
