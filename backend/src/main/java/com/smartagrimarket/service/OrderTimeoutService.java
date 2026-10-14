package com.smartagrimarket.service;

import com.smartagrimarket.entity.Commande;
import com.smartagrimarket.entity.Produit;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.StatutCommande;
import com.smartagrimarket.repository.CommandeRepository;
import com.smartagrimarket.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderTimeoutService {

    private static final long TIMEOUT_HEURES = 48;

    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;
    private final NotificationService notificationService;

    @Transactional
    @Scheduled(fixedRate = 3600000)
    public void verifierCommandesEnAttente() {
        LocalDateTime seuil = LocalDateTime.now().minusHours(TIMEOUT_HEURES);
        List<Commande> staleOrders = commandeRepository.findStaleOrders(StatutCommande.EN_ATTENTE, seuil);

        for (Commande commande : staleOrders) {
            try {
                commande.setStatut(StatutCommande.ANNULEE);
                commandeRepository.save(commande);

                // Restore stock
                if (commande.getLignes() != null) {
                    commande.getLignes().forEach(ligne -> {
                        Produit p = ligne.getProduit();
                        p.setQuantiteDisponible(p.getQuantiteDisponible() + ligne.getQuantite());
                        produitRepository.save(p);
                    });
                }

                // Notify buyer
                Utilisateur acheteur = commande.getAcheteur();
                notificationService.creer(
                    acheteur.getId(),
                    "Commande annulée — vendeur non réactif",
                    "Votre commande #" + commande.getId().toString().substring(0, 8)
                        + " a été annulée car le vendeur n'a pas répondu sous " + TIMEOUT_HEURES + "h."
                        + " Consultez les produits similaires disponibles.",
                    "COMMANDE",
                    "/produits"
                );

                // Notify seller
                if (commande.getProducteur() != null) {
                    notificationService.creer(
                        commande.getProducteur().getId(),
                        "Commande perdue — absence de réponse",
                        "Vous avez perdu une commande de " + acheteur.getPrenom() + " " + acheteur.getNom()
                            + " faute de réponse sous " + TIMEOUT_HEURES + "h.",
                        "COMMANDE",
                        "/produits/ventes"
                    );
                }

                log.info("Commande {} annulée automatiquement (vendeur non réactif)", commande.getId());
            } catch (Exception e) {
                log.error("Erreur lors du timeout de la commande {}: {}", commande.getId(), e.getMessage());
            }
        }
    }
}
