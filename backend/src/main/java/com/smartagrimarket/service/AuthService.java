package com.smartagrimarket.service;

import com.smartagrimarket.dto.AuthResponse;
import com.smartagrimarket.dto.LoginRequest;
import com.smartagrimarket.dto.RegisterRequest;
import com.smartagrimarket.dto.UtilisateurResponse;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.UtilisateurRepository;
import com.smartagrimarket.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .localite(request.getLocalite())
                .type(request.getType())
                .estVerifie(false)
                .build();

        utilisateur = utilisateurRepository.save(utilisateur);
        String token = jwtUtil.generateToken(utilisateur.getId(), utilisateur.getEmail());

        return new AuthResponse(token, UtilisateurResponse.from(utilisateur));
    }

    public AuthResponse login(LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(utilisateur.getId(), utilisateur.getEmail());
        return new AuthResponse(token, UtilisateurResponse.from(utilisateur));
    }
}
