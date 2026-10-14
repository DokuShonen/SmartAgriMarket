package com.smartagrimarket.controller;

import com.smartagrimarket.dto.CommentaireRequest;
import com.smartagrimarket.dto.CommentaireResponse;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.CommentaireService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/commentaires")
@RequiredArgsConstructor
public class CommentaireController {

    private final CommentaireService commentaireService;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<CommentaireResponse> creer(@Valid @RequestBody CommentaireRequest request) {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentaireService.creer(userId, request));
    }

    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<CommentaireResponse>> getParArticle(@PathVariable UUID articleId) {
        UUID userId = securityUtil.getCurrentUserIdOrNull();
        return ResponseEntity.ok(commentaireService.getParArticle(articleId, userId));
    }

    @GetMapping("/apprentissage/{contenuApprentissageId}")
    public ResponseEntity<List<CommentaireResponse>> getParApprentissage(@PathVariable UUID contenuApprentissageId) {
        UUID userId = securityUtil.getCurrentUserIdOrNull();
        return ResponseEntity.ok(commentaireService.getParApprentissage(contenuApprentissageId, userId));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<CommentaireResponse> toggleLike(@PathVariable UUID id) {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(commentaireService.toggleLike(id, userId));
    }

    @GetMapping("/article/{articleId}/count")
    public ResponseEntity<Map<String, Long>> count(@PathVariable UUID articleId) {
        return ResponseEntity.ok(Map.of("count", commentaireService.countParArticle(articleId)));
    }

    @GetMapping("/apprentissage/{contenuApprentissageId}/count")
    public ResponseEntity<Map<String, Long>> countApprentissage(@PathVariable UUID contenuApprentissageId) {
        return ResponseEntity.ok(Map.of("count", commentaireService.countParApprentissage(contenuApprentissageId)));
    }
}
