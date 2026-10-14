package com.smartagrimarket.dto;

import com.smartagrimarket.entity.Notification;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String titre,
        String contenu,
        boolean estLue,
        String type,
        String lien,
        LocalDateTime dateCreation
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitre(),
                n.getContenu(),
                n.isEstLue(),
                n.getType(),
                n.getLien(),
                n.getDateCreation()
        );
    }
}
