package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Signalement;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SignalementResponse {
    private String id;
    private String typeCible;
    private String cibleId;
    private String cibleNom;
    private String motif;
    private String statut;
    private String auteurPrenom;
    private String auteurNom;
    private LocalDateTime dateCreation;

    public static SignalementResponse from(Signalement s, String cibleNom) {
        return SignalementResponse.builder()
                .id(s.getId().toString())
                .typeCible(s.getTypeCible())
                .cibleId(s.getCibleId().toString())
                .cibleNom(cibleNom)
                .motif(s.getMotif())
                .statut(s.getStatut())
                .auteurPrenom(s.getAuteur().getPrenom())
                .auteurNom(s.getAuteur().getNom())
                .dateCreation(s.getDateCreation())
                .build();
    }
}
