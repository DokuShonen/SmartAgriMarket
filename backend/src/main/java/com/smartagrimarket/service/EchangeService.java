package com.smartagrimarket.service;

import com.smartagrimarket.dto.PropositionEchangeRequest;
import com.smartagrimarket.dto.PropositionEchangeResponse;
import com.smartagrimarket.entity.AnnonceMateriel;
import com.smartagrimarket.entity.PropositionEchange;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.AnnonceMaterielRepository;
import com.smartagrimarket.repository.PropositionEchangeRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EchangeService {

    private final PropositionEchangeRepository propositionRepository;
    private final AnnonceMaterielRepository annonceRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public PropositionEchangeResponse proposer(UUID proposantId, PropositionEchangeRequest request) {
        Utilisateur proposant = utilisateurRepository.findById(proposantId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        AnnonceMateriel annonce = annonceRepository.findById(request.getAnnonceId())
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));

        AnnonceMateriel annonceEchange = null;
        if (request.getAnnonceEchangeId() != null) {
            annonceEchange = annonceRepository.findById(request.getAnnonceEchangeId()).orElse(null);
        }

        PropositionEchange proposition = PropositionEchange.builder()
                .description(request.getDescription())
                .valeurProposee(request.getValeurProposee())
                .annonce(annonce)
                .proposant(proposant)
                .annonceEchange(annonceEchange)
                .build();

        return PropositionEchangeResponse.from(propositionRepository.save(proposition));
    }

    @Transactional(readOnly = true)
    public List<PropositionEchangeResponse> getParAnnonce(UUID annonceId) {
        return propositionRepository.findByAnnonceId(annonceId).stream()
                .map(PropositionEchangeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PropositionEchangeResponse> getMesPropositions(UUID proposantId) {
        return propositionRepository.findByProposantId(proposantId).stream()
                .map(PropositionEchangeResponse::from)
                .toList();
    }

    @Transactional
    public PropositionEchangeResponse accepter(UUID propositionId) {
        PropositionEchange p = propositionRepository.findById(propositionId)
                .orElseThrow(() -> new RuntimeException("Proposition introuvable"));
        p.setStatut("ACCEPTEE");
        return PropositionEchangeResponse.from(propositionRepository.save(p));
    }

    @Transactional
    public PropositionEchangeResponse refuser(UUID propositionId) {
        PropositionEchange p = propositionRepository.findById(propositionId)
                .orElseThrow(() -> new RuntimeException("Proposition introuvable"));
        p.setStatut("REFUSEE");
        return PropositionEchangeResponse.from(propositionRepository.save(p));
    }
}
