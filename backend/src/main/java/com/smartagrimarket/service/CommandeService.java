package com.smartagrimarket.service;

import com.smartagrimarket.dto.CommandeRequest;
import com.smartagrimarket.dto.CommandeResponse;
import com.smartagrimarket.dto.ProduitResponse;
import com.smartagrimarket.entity.*;
import com.smartagrimarket.entity.enums.StatutCommande;
import com.smartagrimarket.repository.*;
import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PaiementRepository paiementRepository;
    private final DemandeLivraisonRepository demandeLivraisonRepository;
    private final SuiviLivraisonRepository suiviLivraisonRepository;
    private final NotificationService notificationService;

    @Transactional
    public CommandeResponse create(UUID acheteurId, CommandeRequest request) {
        Utilisateur acheteur = utilisateurRepository.findById(acheteurId)
                .orElseThrow(() -> new RuntimeException("Acheteur introuvable"));

        Commande commande = Commande.builder()
                .statut(StatutCommande.EN_ATTENTE)
                .acheteur(acheteur)
                .adresseLivraison(request.getAdresseLivraison())
                .notes(request.getNotes())
                .fraisLivraison(request.getFraisLivraison())
                .modePaiement(request.getModePaiement())
                .lignes(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        Utilisateur producteur = null;

        try {
            for (CommandeRequest.LigneCommandeRequest ligneReq : request.getLignes()) {
                Produit produit = produitRepository.findById(ligneReq.getProduitId())
                        .orElseThrow(() -> new RuntimeException("Produit introuvable: " + ligneReq.getProduitId()));

                if (produit.getQuantiteDisponible() < ligneReq.getQuantite()) {
                    throw new RuntimeException("Stock insuffisant pour: " + produit.getTitre());
                }

                if (producteur == null) {
                    producteur = produit.getVendeur();
                } else if (!producteur.getId().equals(produit.getVendeur().getId())) {
                    throw new RuntimeException("Tous les produits doivent être du même vendeur");
                }

                BigDecimal sousTotal = produit.getPrix().multiply(BigDecimal.valueOf(ligneReq.getQuantite()));
                total = total.add(sousTotal);

                LigneCommande ligne = LigneCommande.builder()
                        .quantite(ligneReq.getQuantite())
                        .prixUnitaire(produit.getPrix())
                        .produit(produit)
                        .commande(commande)
                        .build();
                commande.getLignes().add(ligne);

                produit.setQuantiteDisponible(produit.getQuantiteDisponible() - ligneReq.getQuantite());
            }
        } catch (ObjectOptimisticLockingFailureException | OptimisticLockException e) {
            throw new RuntimeException("Le stock a été modifié par un autre utilisateur. Veuillez réessayer.");
        }

        commande.setProducteur(producteur);
        commande.setMontantTotal(total);

        CommandeResponse response = CommandeResponse.from(commandeRepository.save(commande));

        notificationService.creer(producteur.getId(), "Nouvelle commande",
                "Vous avez reçu une nouvelle commande de " + acheteur.getPrenom() + " " + acheteur.getNom() + " pour " + total + " FCFA. Veuillez confirmer.",
                "COMMANDE", "/produits/ventes");

        notificationService.creer(acheteur.getId(), "Commande en attente",
                "Votre commande de " + total + " FCFA a été envoyée au vendeur. En attente de sa confirmation.",
                "COMMANDE", "/profil");

        return response;
    }

    @Transactional
    public CommandeResponse confirmerCommande(UUID id, UUID producteurId) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!commande.getProducteur().getId().equals(producteurId)) {
            throw new RuntimeException("Vous n'êtes pas le vendeur de cette commande");
        }

        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new RuntimeException("Seules les commandes en attente peuvent être confirmées");
        }

        commande.setStatut(StatutCommande.CONFIRMEE);
        CommandeResponse response = CommandeResponse.from(commandeRepository.save(commande));

        notificationService.creer(commande.getAcheteur().getId(), "Commande confirmée",
                "Votre commande #" + id.toString().substring(0, 8) + " a été confirmée par le vendeur. Vous pouvez maintenant procéder au paiement.",
                "COMMANDE", "/profil");

        return response;
    }

    @Transactional
    public CommandeResponse preparerCommande(UUID id, UUID producteurId) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!commande.getProducteur().getId().equals(producteurId)) {
            throw new RuntimeException("Vous n'êtes pas le vendeur de cette commande");
        }

        if (commande.getStatut() != StatutCommande.CONFIRMEE) {
            throw new RuntimeException("Seules les commandes confirmées peuvent être mises en préparation");
        }

        commande.setStatut(StatutCommande.EN_PREPARATION);
        CommandeResponse response = CommandeResponse.from(commandeRepository.save(commande));

        notificationService.creer(commande.getAcheteur().getId(), "Commande en préparation",
                "Votre commande #" + id.toString().substring(0, 8) + " est en cours de préparation.",
                "COMMANDE", "/profil");

        return response;
    }

    @Transactional
    public CommandeResponse expedierCommande(UUID id, UUID producteurId) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!commande.getProducteur().getId().equals(producteurId)) {
            throw new RuntimeException("Vous n'êtes pas le vendeur de cette commande");
        }

        if (commande.getStatut() != StatutCommande.EN_PREPARATION && commande.getStatut() != StatutCommande.CONFIRMEE) {
            throw new RuntimeException("La commande doit être en préparation ou confirmée pour être expédiée");
        }

        commande.setStatut(StatutCommande.EN_COURS_LIVRAISON);
        commandeRepository.save(commande);

        try {
            DemandeLivraison demande = DemandeLivraison.builder()
                    .adresseDepart(commande.getProducteur().getLocalite() != null ? commande.getProducteur().getLocalite() : "Non renseigné")
                    .adresseArrivee(commande.getAdresseLivraison() != null ? commande.getAdresseLivraison() : "Non renseigné")
                    .distanceKm(estimateDistance(commande.getProducteur().getLocalite(), commande.getAdresseLivraison()))
                    .frais(BigDecimal.valueOf(50).multiply(BigDecimal.valueOf(estimateDistance(commande.getProducteur().getLocalite(), commande.getAdresseLivraison()))))
                    .commande(commande)
                    .statut("EN_COURS")
                    .build();
            demandeLivraisonRepository.save(demande);

            SuiviLivraison suivi = SuiviLivraison.builder()
                    .statut("Expédié par le producteur")
                    .localisation(commande.getProducteur().getLocalite())
                    .demandeLivraison(demande)
                    .build();
            suiviLivraisonRepository.save(suivi);
        } catch (Exception e) {
            System.err.println("Erreur création demande livraison: " + e.getMessage());
        }

        try {
            UUID acheteurId = commande.getAcheteur().getId();
            notificationService.creer(acheteurId, "Commande expédiée",
                    "Votre commande #" + id.toString().substring(0, 8) + " a été expédiée par le vendeur.",
                    "COMMANDE", "/profil");
        } catch (Exception e) {
            System.err.println("Erreur notification expédition: " + e.getMessage());
        }

        return CommandeResponse.from(commande);
    }

    @Transactional
    public CommandeResponse enregistrerPaiement(UUID id, UUID acheteurId, String methode) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!commande.getAcheteur().getId().equals(acheteurId)) {
            throw new RuntimeException("Vous n'êtes pas l'acheteur de cette commande");
        }

        if (commande.getStatut() != StatutCommande.CONFIRMEE) {
            throw new RuntimeException("La commande doit être confirmée par le vendeur avant le paiement");
        }

        if (commande.getPaiement() != null) {
            throw new RuntimeException("Un paiement existe déjà pour cette commande");
        }

        String statutPaiement = "PAIEMENT_LIVRAISON".equals(methode) ? "EN_ATTENTE" : "PAYE";

        Paiement paiement = Paiement.builder()
                .commande(commande)
                .montant(commande.getMontantTotal().add(
                        commande.getFraisLivraison() != null ? commande.getFraisLivraison() : BigDecimal.ZERO))
                .methode(methode)
                .statut(statutPaiement)
                .rembourse(false)
                .build();
        paiementRepository.save(paiement);

        commande.setPaiement(paiement);

        String msgAcheteur = "PAIEMENT_LIVRAISON".equals(methode)
                ? "Paiement à la livraison enregistré pour la commande #" + id.toString().substring(0, 8) + ". Vous paierez à la réception."
                : "Paiement de " + paiement.getMontant() + " FCFA enregistré pour la commande #" + id.toString().substring(0, 8);

        notificationService.creer(acheteurId, "Paiement enregistré", msgAcheteur, "COMMANDE", "/profil");
        notificationService.creer(commande.getProducteur().getId(), "Paiement reçu",
                "Le paiement pour la commande #" + id.toString().substring(0, 8) + " a été enregistré.",
                "COMMANDE", "/produits/ventes");

        return CommandeResponse.from(commandeRepository.save(commande));
    }

    @Transactional(readOnly = true)
    public List<CommandeResponse> getByAcheteur(UUID acheteurId) {
        return commandeRepository.findByAcheteurId(acheteurId).stream()
                .map(CommandeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CommandeResponse> getByProducteur(UUID producteurId) {
        return commandeRepository.findByProducteurId(producteurId).stream()
                .map(CommandeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CommandeResponse> getAll() {
        return commandeRepository.findAllWithDetails().stream()
                .map(CommandeResponse::from)
                .toList();
    }

    @Transactional
    public CommandeResponse rembourser(UUID id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (commande.getStatut() != StatutCommande.ANNULEE) {
            throw new RuntimeException("Seules les commandes annulées peuvent être remboursées");
        }

        Paiement paiement = commande.getPaiement();
        if (paiement != null && !paiement.isRembourse()) {
            paiement.setRembourse(true);
            paiement.setStatut("REMBOURSE");
        }

        CommandeResponse response = CommandeResponse.from(commandeRepository.save(commande));

        try {
            notificationService.creer(commande.getAcheteur().getId(), "Remboursement effectué",
                    "Votre commande #" + id.toString().substring(0, 8) + " a été remboursée.",
                    "COMMANDE", "/profil");
        } catch (Exception e) {
            System.err.println("Erreur notification remboursement: " + e.getMessage());
        }

        return response;
    }

    @Transactional
    public CommandeResponse updateStatut(UUID id, StatutCommande statut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));
        commande.setStatut(statut);
        CommandeResponse response = CommandeResponse.from(commandeRepository.save(commande));

        String statutLabel = switch (statut) {
            case CONFIRMEE -> "confirmée";
            case EN_PREPARATION -> "en préparation";
            case EN_COURS_LIVRAISON -> "en cours de livraison";
            case LIVREE -> "livrée";
            case ANNULEE -> "annulée";
            default -> statut.name();
        };
        notificationService.creer(commande.getAcheteur().getId(), "Statut commande mis à jour",
                "Votre commande #" + id.toString().substring(0, 8) + " est maintenant " + statutLabel,
                "COMMANDE", "/profil");

        notificationService.creer(commande.getProducteur().getId(), "Statut commande mis à jour",
                "La commande #" + id.toString().substring(0, 8) + " est maintenant " + statutLabel,
                "COMMANDE", "/produits/ventes");

        return response;
    }

    @Transactional
    public CommandeResponse confirmerReception(UUID id, UUID acheteurId) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (!commande.getAcheteur().getId().equals(acheteurId)) {
            throw new RuntimeException("Vous n'êtes pas l'acheteur de cette commande");
        }

        if (commande.getStatut() != StatutCommande.EN_COURS_LIVRAISON) {
            throw new RuntimeException("La commande doit être en cours de livraison pour confirmer la réception");
        }

        return updateStatut(id, StatutCommande.LIVREE);
    }

    @Transactional(readOnly = true)
    public List<ProduitResponse> trouverAlternatives(UUID commandeId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (commande.getLignes() == null || commande.getLignes().isEmpty()) {
            return List.of();
        }

        UUID categorieId = commande.getLignes().get(0).getProduit().getCategorie().getId();
        UUID vendeurId = commande.getProducteur().getId();
        String localite = commande.getLignes().get(0).getProduit().getLocalite();

        return produitRepository.findByCategorieId(categorieId).stream()
                .filter(p -> !p.getVendeur().getId().equals(vendeurId))
                .filter(p -> p.getQuantiteDisponible() > 0)
                .filter(p -> localite == null || localite.equals(p.getLocalite()))
                .map(ProduitResponse::from)
                .toList();
    }

    private Float estimateDistance(String depart, String arrivee) {
        if (depart == null || arrivee == null) return 10f;
        if (depart.equals(arrivee)) return 5f;
        int hash = Math.abs((depart + arrivee).hashCode());
        return 10f + (hash % 290);
    }
}
