package com.smartagrimarket.controller;

import com.smartagrimarket.dto.ProduitVedetteResponse;
import com.smartagrimarket.entity.Produit;
import com.smartagrimarket.repository.ProduitRepository;
import com.smartagrimarket.repository.ProduitVedetteRepository;
import com.smartagrimarket.entity.ProduitVedette;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/produits-vedettes")
@RequiredArgsConstructor
public class ProduitVedetteController {

    private final ProduitVedetteRepository produitVedetteRepository;
    private final ProduitRepository produitRepository;

    @GetMapping
    public ResponseEntity<List<ProduitVedetteResponse>> getActifs() {
        List<ProduitVedetteResponse> response = produitVedetteRepository.findByEstActive(true).stream()
                .map(ProduitVedetteResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ProduitVedetteResponse> ajouter(@RequestBody Map<String, String> body) {
        UUID produitId = UUID.fromString(body.get("produitId"));
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        ProduitVedette pv = ProduitVedette.builder()
                .produit(produit)
                .dateDebut(LocalDateTime.now())
                .dateFin(LocalDateTime.now().plusDays(14))
                .estActive(true)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProduitVedetteResponse.from(produitVedetteRepository.save(pv)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        produitVedetteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
