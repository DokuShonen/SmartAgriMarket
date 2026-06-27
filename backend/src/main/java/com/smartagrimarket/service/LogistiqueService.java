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
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LogistiqueService {

    private final DemandeLivraisonRepository demandeLivraisonRepository;
    private final SuiviLivraisonRepository suiviLivraisonRepository;
    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public DemandeLivraison create(UUID commandeId, UUID acheteurId, DemandeLivraisonRequest request) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        DemandeLivraison demande = DemandeLivraison.builder()
                .adresseDepart(commande.getProducteur().getLocalite())
                .adresseArrivee(request.getAdresseArrivee())
                .commande(commande)
                .statut("EN_ATTENTE")
                .build();

        commande.setStatut(StatutCommande.EN_PREPARATION);
        return demandeLivraisonRepository.save(demande);
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

        return demandeLivraisonRepository.save(demande);
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

        return demandeLivraisonRepository.save(demande);
    }

    public List<SuiviLivraison> getSuivi(UUID demandeId) {
        return suiviLivraisonRepository.findByDemandeLivraisonIdOrderByDateMAJAsc(demandeId);
    }
}
