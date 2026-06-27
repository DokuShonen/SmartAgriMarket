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

    @Data
    public static class CreerCoursSemence {
        @NotBlank private String produit;
        @NotNull private BigDecimal prix;
        @NotBlank private String localite;
        private String source;
    }
}
