package com.smartagrimarket.service;

import com.smartagrimarket.dto.UpdateUtilisateurRequest;
import com.smartagrimarket.dto.UtilisateurResponse;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurResponse getMe(UUID id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return UtilisateurResponse.from(u);
    }

    public UtilisateurResponse updateMe(UUID id, UpdateUtilisateurRequest request) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (request.getNom() != null) u.setNom(request.getNom());
        if (request.getPrenom() != null) u.setPrenom(request.getPrenom());
        if (request.getTelephone() != null) u.setTelephone(request.getTelephone());
        if (request.getLocalite() != null) u.setLocalite(request.getLocalite());

        return UtilisateurResponse.from(utilisateurRepository.save(u));
    }

    public List<UtilisateurResponse> getAll() {
        return utilisateurRepository.findAll().stream()
                .map(UtilisateurResponse::from)
                .toList();
    }

    public void deleteUser(UUID id) {
        utilisateurRepository.deleteById(id);
    }
}
