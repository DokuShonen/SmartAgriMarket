package com.smartagrimarket.controller;

import com.smartagrimarket.dto.EvaluationRequest;
import com.smartagrimarket.entity.Evaluation;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<Evaluation> create(@Valid @RequestBody EvaluationRequest request) {
        UUID donneurId = securityUtil.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(evaluationService.create(donneurId, request));
    }

    @GetMapping("/receveur/{receveurId}")
    public ResponseEntity<List<Evaluation>> getByReceveur(@PathVariable UUID receveurId) {
        return ResponseEntity.ok(evaluationService.getByReceveur(receveurId));
    }
}
