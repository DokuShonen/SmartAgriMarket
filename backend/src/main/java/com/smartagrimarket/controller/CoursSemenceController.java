package com.smartagrimarket.controller;

import com.smartagrimarket.entity.CoursSemence;
import com.smartagrimarket.repository.CoursSemenceRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cours-semences")
@RequiredArgsConstructor
public class CoursSemenceController {

    private final CoursSemenceRepository coursSemenceRepository;

    @GetMapping
    public ResponseEntity<List<CoursSemence>> getAll() {
        return ResponseEntity.ok(coursSemenceRepository.findAll());
    }

    @GetMapping("/localite/{localite}")
    public ResponseEntity<List<CoursSemence>> getByLocalite(@PathVariable String localite) {
        return ResponseEntity.ok(coursSemenceRepository.findByLocalite(localite));
    }

    @PostMapping
    public ResponseEntity<CoursSemence> create(@Valid @RequestBody CreerCoursSemence request) {
        CoursSemence cours = CoursSemence.builder()
                .produit(request.getProduit())
                .prix(request.getPrix())
                .localite(request.getLocalite())
                .source(request.getSource())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(coursSemenceRepository.save(cours));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoursSemence> update(@PathVariable UUID id, @Valid @RequestBody CreerCoursSemence request) {
        CoursSemence cours = coursSemenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours introuvable"));
        cours.setProduit(request.getProduit());
        cours.setPrix(request.getPrix());
        cours.setLocalite(request.getLocalite());
        cours.setSource(request.getSource());
        return ResponseEntity.ok(coursSemenceRepository.save(cours));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        coursSemenceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreerCoursSemence {
        @NotBlank private String produit;
        @NotNull private BigDecimal prix;
        @NotBlank private String localite;
        private String source;
    }
}
