package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Conversation;
import com.smartagrimarket.entity.Message;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ConversationResponse {
    private UUID id;
    private LocalDateTime dateDebut;
    private boolean estActive;
    private List<String> participants;
    private List<String> participantsPhotos;
    private List<MessageResponse> messages;

    @Data
    public static class MessageResponse {
        private UUID id;
        private String contenu;
        private String contenuFiltre;
        private LocalDateTime dateEnvoi;
        private boolean estLu;
        private UUID expediteurId;
        private String expediteurNom;
        private String expediteurPhoto;
    }

    public static ConversationResponse from(Conversation c) {
        ConversationResponse r = new ConversationResponse();
        r.id = c.getId();
        r.dateDebut = c.getDateDebut();
        r.estActive = c.isEstActive();
        if (c.getParticipants() != null) {
            r.participants = c.getParticipants().stream()
                    .map(u -> u.getPrenom() + " " + u.getNom())
                    .toList();
            r.participantsPhotos = c.getParticipants().stream()
                    .map(u -> u.getPhotoProfil())
                    .toList();
        } else {
            r.participantsPhotos = List.of();
        }
        if (c.getMessages() != null) {
            r.messages = c.getMessages().stream().map(m -> {
                MessageResponse mr = new MessageResponse();
                mr.id = m.getId();
                mr.contenu = m.getContenu();
                mr.contenuFiltre = m.getContenuFiltre();
                mr.dateEnvoi = m.getDateEnvoi();
                mr.estLu = m.isEstLu();
                mr.expediteurId = m.getExpediteur().getId();
                mr.expediteurNom = m.getExpediteur().getPrenom() + " " + m.getExpediteur().getNom();
                mr.expediteurPhoto = m.getExpediteur().getPhotoProfil();
                return mr;
            }).toList();
        } else {
            r.messages = List.of();
            r.participantsPhotos = List.of();
        }
        return r;
    }
}
