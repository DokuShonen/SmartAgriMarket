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
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnnonceMaterielService {

    private final AnnonceMaterielRepository annonceMaterielRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
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
                .duree(request.getDuree())
                .caution(request.getCaution())
                .disponibilites(request.getDisponibilites())
                .build();

        return AnnonceMaterielResponse.from(annonceMaterielRepository.save(annonce));
    }

    @Transactional(readOnly = true)
    public List<AnnonceMaterielResponse> getAll() {
        return annonceMaterielRepository.findAll().stream()
                .map(AnnonceMaterielResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AnnonceMaterielResponse getById(UUID id) {
        return annonceMaterielRepository.findById(id)
                .map(AnnonceMaterielResponse::from)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));
    }

    @Transactional(readOnly = true)
    public List<AnnonceMaterielResponse> getByType(TypeTransaction type) {
        return annonceMaterielRepository.findByTypeTransaction(type).stream()
                .map(AnnonceMaterielResponse::from)
                .toList();
    }

    @Transactional
    public void delete(UUID id) {
        annonceMaterielRepository.deleteById(id);
    }

    @Transactional
    public AnnonceMaterielResponse update(UUID id, UUID vendeurId, AnnonceMaterielRequest request) {
        AnnonceMateriel annonce = annonceMaterielRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));

        if (!annonce.getVendeur().getId().equals(vendeurId)) {
            throw new RuntimeException("Vous ne pouvez modifier que vos propres annonces");
        }

        annonce.setTitre(request.getTitre());
        annonce.setDescription(request.getDescription());
        annonce.setPrix(request.getPrix());
        annonce.setEtat(request.getEtat());
        annonce.setTypeTransaction(request.getTypeTransaction());
        annonce.setLocalite(request.getLocalite());
        annonce.setDuree(request.getDuree());
        annonce.setCaution(request.getCaution());
        annonce.setDisponibilites(request.getDisponibilites());
        if (request.getPhotos() != null) {
            annonce.setPhotos(request.getPhotos());
        }

        return AnnonceMaterielResponse.from(annonceMaterielRepository.save(annonce));
    }
}
