package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.TypeUtilisateur;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UtilisateurResponse {
    private UUID id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String localite;
    private TypeUtilisateur type;
    private LocalDateTime dateInscription;
    private boolean estVerifie;

    public static UtilisateurResponse from(Utilisateur u) {
        UtilisateurResponse r = new UtilisateurResponse();
        r.id = u.getId();
        r.nom = u.getNom();
        r.prenom = u.getPrenom();
        r.email = u.getEmail();
        r.telephone = u.getTelephone();
        r.localite = u.getLocalite();
        r.type = u.getType();
        r.dateInscription = u.getDateInscription();
        r.estVerifie = u.isEstVerifie();
        return r;
    }
}
