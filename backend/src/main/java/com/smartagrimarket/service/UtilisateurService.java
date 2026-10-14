package com.smartagrimarket.service;

import com.smartagrimarket.dto.UpdateUtilisateurRequest;
import com.smartagrimarket.dto.UtilisateurResponse;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.regex.Pattern;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    @Transactional(readOnly = true)
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
        if (request.getPhotoProfil() != null) u.setPhotoProfil(request.getPhotoProfil());
        if (request.getZoneCouverture() != null) u.setZoneCouverture(request.getZoneCouverture());

        return UtilisateurResponse.from(utilisateurRepository.save(u));
    }

    @Transactional(readOnly = true)
    public List<UtilisateurResponse> getAll() {
        return utilisateurRepository.findAll().stream()
                .map(UtilisateurResponse::from)
                .toList();
    }

    public void deleteUser(UUID id) {
        utilisateurRepository.deleteById(id);
    }

    public UtilisateurResponse toggleVerification(UUID id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        u.setEstVerifie(!u.isEstVerifie());
        return UtilisateurResponse.from(utilisateurRepository.save(u));
    }

    public UtilisateurResponse toggleSuspension(UUID id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        u.setEstSuspendu(!u.isEstSuspendu());
        return UtilisateurResponse.from(utilisateurRepository.save(u));
    }

    private static final Pattern PSEUDO_INVALIDE = Pattern.compile(
        "(\\+\\d{1,3}[\\s.-]?\\d{4,14}" +
        "|0\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
        "|\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
        "|[\\w.-]+@[\\w.-]+\\.\\w{2,}" +
        "|https?://\\S+|www\\.\\S+)"
    );

    public UtilisateurResponse updatePseudo(UUID id, String nouveauPseudo) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (nouveauPseudo.length() < 4 || nouveauPseudo.length() > 30) {
            throw new RuntimeException("Le pseudo doit contenir entre 4 et 30 caractères");
        }

        if (PSEUDO_INVALIDE.matcher(nouveauPseudo).find()) {
            throw new RuntimeException("Le pseudo ne doit pas contenir de numéro de téléphone, email ou URL");
        }

        if (utilisateurRepository.findByPseudoForum(nouveauPseudo).isPresent()) {
            throw new RuntimeException("Ce pseudo est déjà utilisé");
        }

        String lowerPseudo = nouveauPseudo.toLowerCase();
        String lowerNom = u.getNom().toLowerCase();
        String lowerPrenom = u.getPrenom().toLowerCase();
        String lowerLocalite = u.getLocalite().toLowerCase();

        if (lowerPseudo.contains(lowerNom) || lowerPseudo.contains(lowerPrenom)) {
            throw new RuntimeException("Le pseudo ne doit pas contenir votre nom ou prénom");
        }

        for (String mot : lowerLocalite.split("[\\s,-]+")) {
            if (mot.length() > 2 && lowerPseudo.contains(mot)) {
                throw new RuntimeException("Le pseudo ne doit pas contenir votre localité");
            }
        }

        u.setPseudoForum(nouveauPseudo);
        return UtilisateurResponse.from(utilisateurRepository.save(u));
    }
}
