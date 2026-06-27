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
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class MessagerieService {

    private static final Pattern COORDONNEES_PATTERN =
            Pattern.compile("\\b(\\+?\\d{8,15}|[\\w.-]+@[\\w.-]+\\.\\w{2,}|https?://\\S+)\\b");

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProduitRepository produitRepository;

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
        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation introuvable"));

        String contenuFiltre = filterCoordonnees(request.getContenu());

        Message message = Message.builder()
                .contenu(request.getContenu())
                .contenuFiltre(contenuFiltre)
                .conversation(conversation)
                .expediteur(expediteur)
                .build();

        messageRepository.save(message);

        return ConversationResponse.from(conversationRepository.findById(conversation.getId()).orElseThrow());
    }

    public List<ConversationResponse> getConversationsByUser(UUID userId) {
        return conversationRepository.findByParticipantId(userId).stream()
                .map(ConversationResponse::from)
                .toList();
    }

    private String filterCoordonnees(String contenu) {
        return COORDONNEES_PATTERN.matcher(contenu).replaceAll("[coordonnées masquées]");
    }
}
