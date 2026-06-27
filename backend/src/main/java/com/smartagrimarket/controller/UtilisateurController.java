package com.smartagrimarket.controller;

import com.smartagrimarket.dto.UpdateUtilisateurRequest;
import com.smartagrimarket.dto.UtilisateurResponse;
import com.smartagrimarket.security.SecurityUtil;
import java.util.UUID;
import com.smartagrimarket.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;
    private final SecurityUtil securityUtil;

    @GetMapping("/me")
    public ResponseEntity<UtilisateurResponse> getMe() {
        UUID id = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(utilisateurService.getMe(id));
    }

    @PutMapping("/me")
    public ResponseEntity<UtilisateurResponse> updateMe(@RequestBody UpdateUtilisateurRequest request) {
        UUID id = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(utilisateurService.updateMe(id, request));
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurResponse>> getAll() {
        return ResponseEntity.ok(utilisateurService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        utilisateurService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
