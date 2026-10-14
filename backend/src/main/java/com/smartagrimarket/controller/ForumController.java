package com.smartagrimarket.controller;

import com.smartagrimarket.dto.ArticleForumRequest;
import com.smartagrimarket.entity.ArticleForum;
import com.smartagrimarket.entity.ContenuApprentissage;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.ForumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final SecurityUtil securityUtil;

    @GetMapping("/articles")
    public ResponseEntity<List<ArticleForum>> getAllArticles() {
        return ResponseEntity.ok(forumService.getAllArticles());
    }

    @GetMapping("/articles/recherche")
    public ResponseEntity<List<ArticleForum>> rechercher(@RequestParam String q) {
        return ResponseEntity.ok(forumService.rechercherArticles(q));
    }

    @PostMapping("/articles")
    public ResponseEntity<ArticleForum> createArticle(@Valid @RequestBody ArticleForumRequest request) {
        UUID auteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(forumService.createArticle(
                        request.getTitre(), request.getContenu(),
                        request.getCategorie(), auteurId));
    }

    @PatchMapping("/articles/{id}/moderer")
    public ResponseEntity<ArticleForum> moderer(
            @PathVariable UUID id,
            @RequestParam boolean estModere) {
        return ResponseEntity.ok(forumService.modererArticle(id, estModere));
    }

    @DeleteMapping("/articles/{id}")
    public ResponseEntity<Void> supprimerArticle(@PathVariable UUID id) {
        forumService.supprimerArticle(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/apprentissage")
    public ResponseEntity<List<ContenuApprentissage>> getAllContenus() {
        return ResponseEntity.ok(forumService.getAllContenus());
    }

    @GetMapping("/apprentissage/{id}")
    public ResponseEntity<ContenuApprentissage> getContenuById(@PathVariable UUID id) {
        return ResponseEntity.ok(forumService.getContenuById(id));
    }

    @PostMapping("/apprentissage")
    public ResponseEntity<ContenuApprentissage> createContenu(
            @RequestParam String titre,
            @RequestParam String typeContenu,
            @RequestParam String contenu) {
        UUID auteurId = securityUtil.getCurrentUserIdOrNull();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(forumService.createContenu(titre, typeContenu, contenu, auteurId));
    }

    @PatchMapping("/apprentissage/{id}/valider")
    public ResponseEntity<ContenuApprentissage> validerContenu(@PathVariable UUID id) {
        UUID valideParId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(forumService.validerContenu(id, valideParId));
    }

    @DeleteMapping("/apprentissage/{id}")
    public ResponseEntity<Void> deleteContenu(@PathVariable UUID id) {
        forumService.deleteContenu(id);
        return ResponseEntity.noContent().build();
    }
}
