package com.smartagrimarket.service;

import com.smartagrimarket.dto.EvaluationRequest;
import com.smartagrimarket.entity.Evaluation;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.EvaluationRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public Evaluation create(UUID donneurId, EvaluationRequest request) {
        Utilisateur donneur = utilisateurRepository.findById(donneurId)
                .orElseThrow(() -> new RuntimeException("Donneur introuvable"));
        Utilisateur receveur = utilisateurRepository.findById(request.getReceveurId())
                .orElseThrow(() -> new RuntimeException("Receveur introuvable"));

        Evaluation evaluation = Evaluation.builder()
                .note(request.getNote())
                .commentaire(request.getCommentaire())
                .donneur(donneur)
                .receveur(receveur)
                .build();

        return evaluationRepository.save(evaluation);
    }

    public List<Evaluation> getByReceveur(UUID receveurId) {
        return evaluationRepository.findByReceveurId(receveurId);
    }
}
