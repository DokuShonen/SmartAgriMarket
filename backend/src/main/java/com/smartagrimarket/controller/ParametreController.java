package com.smartagrimarket.controller;

import com.smartagrimarket.dto.ParametreRequest;
import com.smartagrimarket.dto.ParametreResponse;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.ParametreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/parametres")
@RequiredArgsConstructor
public class ParametreController {

    private final ParametreService parametreService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<List<ParametreResponse>> getAll() {
        securityUtil.checkSuperAdmin();
        return ResponseEntity.ok(parametreService.getAll());
    }

    @GetMapping("/{cle}")
    public ResponseEntity<ParametreResponse> getByCle(@PathVariable String cle) {
        securityUtil.checkSuperAdmin();
        return ResponseEntity.ok(parametreService.getByCle(cle));
    }

    @PutMapping
    public ResponseEntity<ParametreResponse> save(@Valid @RequestBody ParametreRequest request) {
        securityUtil.checkSuperAdmin();
        return ResponseEntity.ok(parametreService.save(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        securityUtil.checkSuperAdmin();
        parametreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
