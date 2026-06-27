package com.smartagrimarket.controller;

import com.smartagrimarket.entity.ProduitVedette;
import com.smartagrimarket.repository.ProduitVedetteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produits-vedettes")
@RequiredArgsConstructor
public class ProduitVedetteController {

    private final ProduitVedetteRepository produitVedetteRepository;

    @GetMapping
    public ResponseEntity<List<ProduitVedette>> getActifs() {
        return ResponseEntity.ok(produitVedetteRepository.findByEstActive(true));
    }
}
