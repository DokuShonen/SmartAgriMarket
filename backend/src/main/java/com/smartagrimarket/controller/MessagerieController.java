package com.smartagrimarket.controller;

import com.smartagrimarket.dto.ConversationResponse;
import com.smartagrimarket.dto.MessageRequest;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.MessagerieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messagerie")
@RequiredArgsConstructor
public class MessagerieController {

    private final MessagerieService messagerieService;
    private final SecurityUtil securityUtil;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> createConversation(
            @RequestParam UUID destinataireId,
            @RequestParam(required = false) UUID produitId) {
        UUID expediteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messagerieService.createConversation(expediteurId, destinataireId, produitId));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getMesConversations() {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(messagerieService.getConversationsByUser(userId));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationResponse> getConversation(@PathVariable UUID id) {
        UUID userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(messagerieService.getConversationById(id, userId));
    }

    @PostMapping("/messages")
    public ResponseEntity<ConversationResponse> sendMessage(
            @Valid @RequestBody MessageRequest request) {
        UUID expediteurId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(messagerieService.sendMessage(expediteurId, request));
    }
}
