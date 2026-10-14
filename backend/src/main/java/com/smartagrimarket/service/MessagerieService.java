package com.smartagrimarket.service;

import com.smartagrimarket.dto.ConversationResponse;
import com.smartagrimarket.dto.MessageRequest;
import com.smartagrimarket.entity.Conversation;
import com.smartagrimarket.entity.Message;
import com.smartagrimarket.entity.Produit;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.ConversationRepository;
import com.smartagrimarket.repository.MessageRepository;
import com.smartagrimarket.repository.ProduitRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessagerieService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProduitRepository produitRepository;
    private final NotificationService notificationService;

    public ConversationResponse createConversation(UUID acheteurId, UUID producteurId, UUID produitId) {
        Utilisateur acheteur = utilisateurRepository.findById(acheteurId)
                .orElseThrow(() -> new RuntimeException("Acheteur introuvable"));
        Utilisateur producteur = utilisateurRepository.findById(producteurId)
                .orElseThrow(() -> new RuntimeException("Producteur introuvable"));

        Conversation conversation = Conversation.builder()
                .participants(Set.of(acheteur, producteur))
                .build();

        return ConversationResponse.from(conversationRepository.save(conversation));
    }

    public ConversationResponse sendMessage(UUID expediteurId, MessageRequest request) {
        Utilisateur expediteur = utilisateurRepository.findById(expediteurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (expediteur.isEstSuspendu()) {
            throw new RuntimeException("Votre compte est suspendu pour tentative de contournement.");
        }

        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));

        String contenuFiltre = ContactFilterService.filterCoordonnees(request.getContenu());
        boolean aEteFiltre = !contenuFiltre.equals(request.getContenu());

        Message message = Message.builder()
                .contenu(request.getContenu())
                .contenuFiltre(contenuFiltre)
                .conversation(conversation)
                .expediteur(expediteur)
                .build();

        messageRepository.save(message);

        try {
            conversation.getParticipants().stream()
                    .filter(p -> !p.getId().equals(expediteurId))
                    .forEach(dest -> notificationService.creer(dest.getId(), "Nouveau message",
                            expediteur.getPrenom() + " " + expediteur.getNom() + " vous a envoyé un message",
                            "MESSAGERIE", "/messagerie/" + conversation.getId()));
        } catch (Exception e) {
            System.err.println("Erreur notification message: " + e.getMessage());
        }

        if (aEteFiltre) {
            expediteur.setViolationsCount(expediteur.getViolationsCount() + 1);
            if (expediteur.getViolationsCount() >= 3) {
                expediteur.setEstSuspendu(true);
            }
            utilisateurRepository.save(expediteur);
        }

        return ConversationResponse.from(conversationRepository.findById(conversation.getId()).orElseThrow());
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversationsByUser(UUID userId) {
        return conversationRepository.findByParticipantId(userId).stream()
                .map(ConversationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConversationResponse getConversationById(UUID conversationId, UUID userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));
        if (c.getParticipants().stream().noneMatch(p -> p.getId().equals(userId))) {
            throw new RuntimeException("Accès refusé");
        }
        return ConversationResponse.from(c);
    }

}
