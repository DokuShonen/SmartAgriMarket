package com.smartagrimarket.security;

import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.TypeUtilisateur;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UtilisateurRepository utilisateurRepository;

    public UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UUID)) {
            throw new RuntimeException("Utilisateur non authentifié");
        }
        return (UUID) auth.getPrincipal();
    }

    public UUID getCurrentUserIdOrNull() {
        try {
            return getCurrentUserId();
        } catch (RuntimeException e) {
            return null;
        }
    }

    public String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .map(a -> a.replace("ROLE_", ""))
                .orElse(null);
    }

    public Utilisateur getCurrentUser() {
        UUID userId = getCurrentUserId();
        return utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public boolean estAdmin() {
        String role = getCurrentUserRole();
        return role != null && Set.of("ADMIN", "SUPER_ADMIN", "MODERATION_SUPPORT").contains(role);
    }

    public boolean estSuperAdmin() {
        String role = getCurrentUserRole();
        return role != null && Set.of("ADMIN", "SUPER_ADMIN", "ADMIN_TECHNIQUE").contains(role);
    }

    public void checkAdmin() {
        if (!estAdmin()) {
            throw new RuntimeException("Accès refusé : vous n'êtes pas administrateur");
        }
    }

    public void checkSuperAdmin() {
        if (!estSuperAdmin()) {
            throw new RuntimeException("Accès refusé : réservé au super-administrateur");
        }
    }

    public void checkModerationSupport() {
        String role = getCurrentUserRole();
        if (role == null || !Set.of("ADMIN", "SUPER_ADMIN", "MODERATION_SUPPORT").contains(role)) {
            throw new RuntimeException("Accès refusé : réservé à la modération support");
        }
    }

    public void checkModerationForum() {
        String role = getCurrentUserRole();
        if (role == null || !Set.of("ADMIN", "SUPER_ADMIN", "MODERATION_SUPPORT", "MODERATION_FORUM").contains(role)) {
            throw new RuntimeException("Accès refusé : réservé à la modération forum");
        }
    }

    public void checkAdminOrAgent() {
        String role = getCurrentUserRole();
        if (role == null || !Set.of("ADMIN", "SUPER_ADMIN", "AGENT_RELAIS").contains(role)) {
            throw new RuntimeException("Accès refusé : vous n'êtes pas administrateur ou agent relais");
        }
    }

    public void checkProducteurOuAdmin() {
        String role = getCurrentUserRole();
        if (role == null || !Set.of("PRODUCTEUR", "ADMIN", "SUPER_ADMIN", "MODERATION_SUPPORT").contains(role)) {
            throw new RuntimeException("Accès refusé : réservé aux producteurs et à l'administration");
        }
    }

    public boolean isCurrentUserRole(String... roles) {
        String role = getCurrentUserRole();
        if (role == null) return false;
        for (String r : roles) {
            if (role.equals(r)) return true;
        }
        return false;
    }
}
