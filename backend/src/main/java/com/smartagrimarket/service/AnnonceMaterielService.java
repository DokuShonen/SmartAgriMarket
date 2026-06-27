package com.smartagrimarket.service;

import com.smartagrimarket.dto.AnnonceMaterielRequest;
import com.smartagrimarket.dto.AnnonceMaterielResponse;
import com.smartagrimarket.entity.AnnonceMateriel;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.TypeTransaction;
import com.smartagrimarket.repository.AnnonceMaterielRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnnonceMaterielService {

    private final AnnonceMaterielRepository annonceMaterielRepository;
    private final UtilisateurRepository utilisateurRepository;

    public AnnonceMaterielResponse create(UUID vendeurId, AnnonceMaterielRequest request) {
        Utilisateur vendeur = utilisateurRepository.findById(vendeurId)
                .orElseThrow(() -> new RuntimeException("Vendeur introuvable"));

        AnnonceMateriel annonce = AnnonceMateriel.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .prix(request.getPrix())
                .etat(request.getEtat())
                .typeTransaction(request.getTypeTransaction())
                .photos(request.getPhotos())
                .localite(request.getLocalite())
                .vendeur(vendeur)
                .build();

        return AnnonceMaterielResponse.from(annonceMaterielRepository.save(annonce));
    }

    public List<AnnonceMaterielResponse> getAll() {
        return annonceMaterielRepository.findAll().stream()
                .map(AnnonceMaterielResponse::from)
                .toList();
    }

    public AnnonceMaterielResponse getById(UUID id) {
        return annonceMaterielRepository.findById(id)
                .map(AnnonceMaterielResponse::from)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));
    }

    public List<AnnonceMaterielResponse> getByType(TypeTransaction type) {
        return annonceMaterielRepository.findByTypeTransaction(type).stream()
                .map(AnnonceMaterielResponse::from)
                .toList();
    }

    public void delete(UUID id) {
        annonceMaterielRepository.deleteById(id);
    }
}
