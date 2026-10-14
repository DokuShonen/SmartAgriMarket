package com.smartagrimarket.controller;

import com.smartagrimarket.dto.PropositionEchangeRequest;
import com.smartagrimarket.dto.PropositionEchangeResponse;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.EchangeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/echanges")
@RequiredArgsConstructor
public class EchangeController {

    private final EchangeService echangeService;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<PropositionEchangeResponse> proposer(@Valid @RequestBody PropositionEchangeRequest request) {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(echangeService.proposer(userId, request));
    }

    @GetMapping("/annonce/{annonceId}")
    public ResponseEntity<List<PropositionEchangeResponse>> getParAnnonce(@PathVariable UUID annonceId) {
        return ResponseEntity.ok(echangeService.getParAnnonce(annonceId));
    }

    @GetMapping("/mes-propositions")
    public ResponseEntity<List<PropositionEchangeResponse>> getMesPropositions() {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(echangeService.getMesPropositions(userId));
    }

    @PatchMapping("/{id}/accepter")
    public ResponseEntity<PropositionEchangeResponse> accepter(@PathVariable UUID id) {
        return ResponseEntity.ok(echangeService.accepter(id));
    }

    @PatchMapping("/{id}/refuser")
    public ResponseEntity<PropositionEchangeResponse> refuser(@PathVariable UUID id) {
        return ResponseEntity.ok(echangeService.refuser(id));
    }
}
