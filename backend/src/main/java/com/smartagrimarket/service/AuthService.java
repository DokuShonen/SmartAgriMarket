package com.smartagrimarket.service;

import com.smartagrimarket.dto.AuthResponse;
import com.smartagrimarket.dto.LoginRequest;
import com.smartagrimarket.dto.RegisterRequest;
import com.smartagrimarket.dto.UtilisateurResponse;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.TypeUtilisateur;
import com.smartagrimarket.repository.UtilisateurRepository;
import com.smartagrimarket.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        var type = request.getType();
        if (type == TypeUtilisateur.ADMIN || type == TypeUtilisateur.MODERATION_SUPPORT
                || type == TypeUtilisateur.SUPER_ADMIN) {
            throw new RuntimeException("Inscription avec ce rôle non autorisée");
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .localite(request.getLocalite())
                .type(type)
                .estVerifie(false)
                .violationsCount(0)
                .estSuspendu(false)
                .pseudoForum(genererPseudo())
                .cnib(request.getCnib())
                .cooperative(request.getCooperative())
                .photoCertificationBio(request.getPhotoCertificationBio())
                .zoneCouverture(request.getZoneCouverture())
                .build();

        utilisateur = utilisateurRepository.save(utilisateur);
        String token = jwtUtil.generateToken(utilisateur.getId(), utilisateur.getEmail(), utilisateur.getType().name());

        return new AuthResponse(token, UtilisateurResponse.from(utilisateur));
    }

    private String genererPseudo() {
        String base;
        String[] prefixes = {"Agri", "Fermier", "Paysan", "Champ", "Semailles", "Recolte", "Culture", "Jardin"};
        for (int i = 0; i < 20; i++) {
            base = prefixes[ThreadLocalRandom.current().nextInt(prefixes.length)]
                    + ThreadLocalRandom.current().nextInt(1000, 9999);
            if (utilisateurRepository.findByPseudoForum(base).isEmpty()) {
                return base;
            }
        }
        return "User" + System.currentTimeMillis() % 10000;
    }

    public AuthResponse login(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(utilisateur.getId(), utilisateur.getEmail(), utilisateur.getType().name());
        return new AuthResponse(token, UtilisateurResponse.from(utilisateur));
    }

    public AuthResponse refreshToken(UUID userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        String token = jwtUtil.generateToken(utilisateur.getId(), utilisateur.getEmail(), utilisateur.getType().name());
        return new AuthResponse(token, UtilisateurResponse.from(utilisateur));
    }

    public void forgotPassword(String email) {
        if (email == null || email.isBlank()) return;
        utilisateurRepository.findByEmail(email).ifPresent(u -> {
            // TODO: envoyer un email avec un lien de réinitialisation
            // String token = jwtUtil.generateToken(u.getId(), u.getEmail());
            // envoyerEmail(u.getEmail(), token);
        });
    }
}
