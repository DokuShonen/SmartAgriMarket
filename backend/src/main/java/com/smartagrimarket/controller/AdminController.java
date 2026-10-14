package com.smartagrimarket.controller;

import com.smartagrimarket.dto.CommentaireResponse;
import com.smartagrimarket.dto.ConversationResponse;
import com.smartagrimarket.dto.CreerAdminRequest;
import com.smartagrimarket.dto.DashboardStats;
import com.smartagrimarket.dto.DashboardStats.MoisStats;
import com.smartagrimarket.dto.UtilisateurResponse;
import com.smartagrimarket.entity.Conversation;
import com.smartagrimarket.entity.Message;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.StatutCommande;
import com.smartagrimarket.entity.enums.TypeUtilisateur;
import com.smartagrimarket.repository.*;
import com.smartagrimarket.security.SecurityUtil;
import com.smartagrimarket.service.CommentaireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final CommentaireRepository commentaireRepository;
    private final CommentaireService commentaireService;
    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProduitRepository produitRepository;
    private final SecurityUtil securityUtil;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getTousLesMessages() {
        securityUtil.checkModerationSupport();
        return ResponseEntity.ok(messageRepository.findAll());
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> supprimerMessage(@PathVariable UUID id) {
        securityUtil.checkModerationSupport();
        messageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getToutesLesConversations() {
        securityUtil.checkModerationSupport();
        List<Conversation> conversations = conversationRepository.findAll();
        List<ConversationResponse> responses = conversations.stream()
                .map(ConversationResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> supprimerConversation(@PathVariable UUID id) {
        securityUtil.checkModerationSupport();
        conversationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/commentaires")
    public ResponseEntity<List<CommentaireResponse>> getTousLesCommentaires() {
        securityUtil.checkModerationForum();
        return ResponseEntity.ok(commentaireService.getAllCommentaires());
    }

    @DeleteMapping("/commentaires/{id}")
    public ResponseEntity<Void> supprimerCommentaire(@PathVariable UUID id) {
        securityUtil.checkModerationForum();
        commentaireRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        securityUtil.checkAdmin();

        List<Utilisateur> users = utilisateurRepository.findAll();
        long totalUsers = users.size();
        long totalProducteurs = users.stream().filter(u -> u.getType() == TypeUtilisateur.PRODUCTEUR).count();
        long totalAcheteurs = users.stream().filter(u -> u.getType() == TypeUtilisateur.ACHETEUR).count();

        List<com.smartagrimarket.entity.Commande> toutes = commandeRepository.findAll();
        long totalCommandes = toutes.size();

        List<com.smartagrimarket.entity.Commande> livrees = toutes.stream()
                .filter(c -> c.getStatut() == StatutCommande.LIVREE)
                .toList();
        long commandesAbouties = livrees.size();
        BigDecimal revenuTotal = livrees.stream()
                .map(c -> c.getMontantTotal() != null ? c.getMontantTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalProduits = produitRepository.count();

        Map<YearMonth, List<com.smartagrimarket.entity.Commande>> grouped = livrees.stream()
                .collect(Collectors.groupingBy(c -> YearMonth.from(c.getDateCreation())));

        List<MoisStats> parMois = grouped.entrySet().stream()
                .map(e -> {
                    YearMonth ym = e.getKey();
                    List<com.smartagrimarket.entity.Commande> cmds = e.getValue();
                    return new MoisStats(
                            ym.getYear(),
                            ym.getMonthValue(),
                            cmds.size(),
                            cmds.stream()
                                    .map(c -> c.getMontantTotal() != null ? c.getMontantTotal() : BigDecimal.ZERO)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    );
                })
                .sorted(Comparator.comparing(MoisStats::getAnnee).thenComparing(MoisStats::getMois))
                .toList();

        return ResponseEntity.ok(new DashboardStats(
                totalUsers, totalProducteurs, totalAcheteurs,
                totalCommandes, commandesAbouties, revenuTotal,
                totalProduits, parMois
        ));
    }

    @PostMapping("/utilisateurs")
    public ResponseEntity<UtilisateurResponse> creerAdmin(@RequestBody CreerAdminRequest request) {
        securityUtil.checkSuperAdmin();
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }
        Utilisateur u = Utilisateur.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .localite(request.getLocalite())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .type(request.getType())
                .estVerifie(true)
                .violationsCount(0)
                .estSuspendu(false)
                .build();
        return ResponseEntity.ok(UtilisateurResponse.from(utilisateurRepository.save(u)));
    }
}
