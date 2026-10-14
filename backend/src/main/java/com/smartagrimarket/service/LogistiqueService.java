package com.smartagrimarket.service;

import com.smartagrimarket.dto.DemandeLivraisonRequest;
import com.smartagrimarket.entity.Commande;
import com.smartagrimarket.entity.DemandeLivraison;
import com.smartagrimarket.entity.SuiviLivraison;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.StatutCommande;
import com.smartagrimarket.repository.CommandeRepository;
import com.smartagrimarket.repository.DemandeLivraisonRepository;
import com.smartagrimarket.repository.SuiviLivraisonRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LogistiqueService {

    private final DemandeLivraisonRepository demandeLivraisonRepository;
    private final SuiviLivraisonRepository suiviLivraisonRepository;
    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    private static final BigDecimal TARIF_PAR_KM = BigDecimal.valueOf(50);

    @Transactional
    public DemandeLivraison create(UUID commandeId, UUID acheteurId, DemandeLivraisonRequest request) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        if (commande.getStatut() != StatutCommande.CONFIRMEE && commande.getStatut() != StatutCommande.EN_PREPARATION) {
            throw new RuntimeException("La commande doit être confirmée et payée avant de demander une livraison");
        }

        if (commande.getPaiement() == null) {
            throw new RuntimeException("Aucun paiement enregistré pour cette commande");
        }

        String depart = commande.getProducteur().getLocalite();
        String arrivee = request.getAdresseArrivee();
        Float distanceKm = estimateDistance(depart, arrivee);
        BigDecimal frais = TARIF_PAR_KM.multiply(BigDecimal.valueOf(distanceKm));

        DemandeLivraison demande = DemandeLivraison.builder()
                .adresseDepart(depart)
                .adresseArrivee(arrivee)
                .distanceKm(distanceKm)
                .frais(frais)
                .commande(commande)
                .statut("EN_ATTENTE")
                .build();

        commande.setStatut(StatutCommande.EN_PREPARATION);
        return demandeLivraisonRepository.save(demande);
    }

    private Float estimateDistance(String depart, String arrivee) {
        if (depart.equals(arrivee)) return 5f;
        int hash = Math.abs((depart + arrivee).hashCode());
        return 10f + (hash % 290);
    }

    @Transactional
    public DemandeLivraison prendreEnCharge(UUID demandeId, UUID partenaireId) {
        DemandeLivraison demande = demandeLivraisonRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));
        Utilisateur partenaire = utilisateurRepository.findById(partenaireId)
                .orElseThrow(() -> new RuntimeException("Partenaire introuvable"));

        demande.setPartenaire(partenaire);
        demande.setStatut("EN_COURS");
        demande.getCommande().setStatut(StatutCommande.EN_COURS_LIVRAISON);

        SuiviLivraison suivi = SuiviLivraison.builder()
                .statut("Prise en charge")
                .demandeLivraison(demande)
                .build();
        suiviLivraisonRepository.save(suivi);

        DemandeLivraison saved = demandeLivraisonRepository.save(demande);

        try {
            UUID acheteurId = demande.getCommande().getAcheteur().getId();
            notificationService.creer(acheteurId, "Livraison en cours",
                    "Votre commande #" + demande.getCommande().getId().toString().substring(0, 8) + " est en cours de livraison par " + partenaire.getPrenom(),
                    "LIVRAISON", "/profil");
        } catch (Exception e) {
            System.err.println("Erreur notification livraison: " + e.getMessage());
        }

        return saved;
    }

    @Transactional
    public DemandeLivraison confirmerLivraison(UUID demandeId) {
        DemandeLivraison demande = demandeLivraisonRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        demande.setStatut("LIVREE");
        demande.getCommande().setStatut(StatutCommande.LIVREE);

        SuiviLivraison suivi = SuiviLivraison.builder()
                .statut("Livrée")
                .localisation(demande.getAdresseArrivee())
                .demandeLivraison(demande)
                .build();
        suiviLivraisonRepository.save(suivi);

        DemandeLivraison saved = demandeLivraisonRepository.save(demande);

        try {
            UUID acheteurId = demande.getCommande().getAcheteur().getId();
            UUID producteurId = demande.getCommande().getProducteur().getId();
            String acheteurNom = demande.getCommande().getAcheteur().getPrenom();
            String producteurNom = demande.getCommande().getProducteur().getPrenom();

            notificationService.creer(acheteurId, "Livraison confirmée",
                    "Votre commande #" + demande.getCommande().getId().toString().substring(0, 8) + " a été livrée. N'hésitez pas à évaluer votre expérience !",
                    "LIVRAISON", "/profil");
            notificationService.creer(producteurId, "Livraison confirmée",
                    "La commande #" + demande.getCommande().getId().toString().substring(0, 8) + " a été livrée à " + acheteurNom,
                    "LIVRAISON", "/produits/ventes");
        } catch (Exception e) {
            System.err.println("Erreur notification livraison: " + e.getMessage());
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<SuiviLivraison> getSuivi(UUID demandeId) {
        return suiviLivraisonRepository.findByDemandeLivraisonIdOrderByDateMAJAsc(demandeId);
    }

    @Transactional(readOnly = true)
    public List<DemandeLivraison> getMesDemandes(UUID userId) {
        return demandeLivraisonRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<DemandeLivraison> getDemandesEnAttente() {
        return demandeLivraisonRepository.findByStatut("EN_ATTENTE");
    }

    public BigDecimal calculerFrais(Float distanceKm) {
        if (distanceKm == null || distanceKm <= 0) return BigDecimal.ZERO;
        return TARIF_PAR_KM.multiply(BigDecimal.valueOf(distanceKm));
    }

    @Transactional(readOnly = true)
    public List<DemandeLivraison> getMesLivraisonsAssignees(UUID userId) {
        return demandeLivraisonRepository.findByUserId(userId).stream()
                .filter(d -> d.getPartenaire() != null && d.getPartenaire().getId().equals(userId))
                .toList();
    }
}
