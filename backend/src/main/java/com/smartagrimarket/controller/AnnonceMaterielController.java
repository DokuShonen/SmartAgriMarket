package com.smartagrimarket.controller;

import com.smartagrimarket.dto.AnnonceMaterielRequest;
import com.smartagrimarket.dto.AnnonceMaterielResponse;
import com.smartagrimarket.entity.enums.TypeTransaction;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.AnnonceMaterielService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/materiel")
@RequiredArgsConstructor
public class AnnonceMaterielController {

    private final AnnonceMaterielService annonceMaterielService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<List<AnnonceMaterielResponse>> getAll() {
        return ResponseEntity.ok(annonceMaterielService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnonceMaterielResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(annonceMaterielService.getById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<AnnonceMaterielResponse>> getByType(@PathVariable TypeTransaction type) {
        return ResponseEntity.ok(annonceMaterielService.getByType(type));
    }

    @PostMapping
    public ResponseEntity<AnnonceMaterielResponse> create(@Valid @RequestBody AnnonceMaterielRequest request) {
        securityUtil.checkProducteurOuAdmin();
        UUID vendeurId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(annonceMaterielService.create(vendeurId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnonceMaterielResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody AnnonceMaterielRequest request) {
        securityUtil.checkProducteurOuAdmin();
        UUID vendeurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(annonceMaterielService.update(id, vendeurId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        annonceMaterielService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
