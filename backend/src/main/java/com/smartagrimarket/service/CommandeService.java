package com.smartagrimarket.service;

import com.smartagrimarket.dto.CommandeRequest;
import com.smartagrimarket.dto.CommandeResponse;
import com.smartagrimarket.entity.*;
import com.smartagrimarket.entity.enums.StatutCommande;
import com.smartagrimarket.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public CommandeResponse create(UUID acheteurId, CommandeRequest request) {
        Utilisateur acheteur = utilisateurRepository.findById(acheteurId)
                .orElseThrow(() -> new RuntimeException("Acheteur introuvable"));

        Commande commande = Commande.builder()
                .statut(StatutCommande.EN_ATTENTE)
                .acheteur(acheteur)
                .adresseLivraison(request.getAdresseLivraison())
                .notes(request.getNotes())
                .lignes(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        Utilisateur producteur = null;

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

        commande.setProducteur(producteur);
        commande.setMontantTotal(total);

        return CommandeResponse.from(commandeRepository.save(commande));
    }

    public List<CommandeResponse> getByAcheteur(UUID acheteurId) {
        return commandeRepository.findByAcheteurId(acheteurId).stream()
                .map(CommandeResponse::from)
                .toList();
    }

    public List<CommandeResponse> getByProducteur(UUID producteurId) {
        return commandeRepository.findByProducteurId(producteurId).stream()
                .map(CommandeResponse::from)
                .toList();
    }

    public CommandeResponse updateStatut(UUID id, StatutCommande statut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));
        commande.setStatut(statut);
        return CommandeResponse.from(commandeRepository.save(commande));
    }
}
