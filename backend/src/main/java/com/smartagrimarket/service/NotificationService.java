package com.smartagrimarket.service;

import com.smartagrimarket.dto.NotificationResponse;
import com.smartagrimarket.entity.Notification;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.NotificationRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import com.smartagrimarket.service.sms.CallService;
import com.smartagrimarket.service.sms.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Set<String> TYPES_AVEC_SMS = Set.of("COMMANDE", "ALERTE", "RAPPEL");
    private static final Set<String> TYPES_AVEC_APPEL = Set.of("ALERTE");

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final SmsService smsService;
    private final CallService callService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Notification creer(UUID utilisateurId, String titre, String contenu, String type, String lien) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Notification n = Notification.builder()
                .titre(titre)
                .contenu(contenu)
                .type(type)
                .lien(lien)
                .utilisateur(utilisateur)
                .build();

        if (utilisateur.getTelephone() != null && !utilisateur.getTelephone().isBlank()) {
            if (TYPES_AVEC_SMS.contains(type)) {
                smsService.envoyer(utilisateur.getTelephone(), titre + " : " + contenu);
            }
            if (TYPES_AVEC_APPEL.contains(type)) {
                callService.appeler(utilisateur.getTelephone(), contenu);
            }
        }

        Notification saved = notificationRepository.save(n);
        messagingTemplate.convertAndSendToUser(
                utilisateurId.toString(),
                "/topic/notifications",
                NotificationResponse.from(saved)
        );
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Notification> getMesNotifications(UUID utilisateurId) {
        return notificationRepository.findByUtilisateurIdOrderByDateCreationDesc(utilisateurId);
    }

    @Transactional(readOnly = true)
    public long getNonLues(UUID utilisateurId) {
        return notificationRepository.countByUtilisateurIdAndEstLueFalse(utilisateurId);
    }

    @Transactional
    public void marquerLue(UUID notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));
        n.setEstLue(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void marquerToutLu(UUID utilisateurId) {
        List<Notification> nonLues = notificationRepository
                .findByUtilisateurIdOrderByDateCreationDesc(utilisateurId)
                .stream().filter(n -> !n.isEstLue()).toList();
        nonLues.forEach(n -> n.setEstLue(true));
        notificationRepository.saveAll(nonLues);
    }
}
