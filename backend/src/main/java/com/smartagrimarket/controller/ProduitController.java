package com.smartagrimarket.controller;

import com.smartagrimarket.dto.ProduitRequest;
import com.smartagrimarket.dto.ProduitResponse;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.ProduitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;
import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
public class ProduitController {

    private final ProduitService produitService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<Page<ProduitResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID categorieId,
            @RequestParam(required = false) String localite,
            @RequestParam(required = false) BigDecimal prixMin,
            @RequestParam(required = false) BigDecimal prixMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                produitService.search(keyword, categorieId, localite, prixMin, prixMax, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(produitService.getById(id));
    }

    @GetMapping("/vendeur/me")
    public ResponseEntity<?> getMesProduits() {
        UUID vendeurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(produitService.getByVendeur(vendeurId));
    }

    @GetMapping("/vendeur/{vendeurId}")
    public ResponseEntity<?> getByVendeur(@PathVariable UUID vendeurId) {
        return ResponseEntity.ok(produitService.getByVendeur(vendeurId));
    }

    @PostMapping
    public ResponseEntity<ProduitResponse> create(@Valid @RequestBody ProduitRequest request) {
        securityUtil.checkProducteurOuAdmin();
        UUID vendeurId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(produitService.create(vendeurId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduitResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProduitRequest request) {
        securityUtil.checkProducteurOuAdmin();
        return ResponseEntity.ok(produitService.update(id, request));
    }

    @PatchMapping("/{id}/toggle-actif")
    public ResponseEntity<ProduitResponse> toggleActif(@PathVariable UUID id) {
        return ResponseEntity.ok(produitService.toggleActif(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/all")
    public ResponseEntity<Page<ProduitResponse>> searchAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID categorieId,
            @RequestParam(required = false) String localite,
            @RequestParam(required = false) BigDecimal prixMin,
            @RequestParam(required = false) BigDecimal prixMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                produitService.searchAll(keyword, categorieId, localite, prixMin, prixMax, page, size));
    }
}
