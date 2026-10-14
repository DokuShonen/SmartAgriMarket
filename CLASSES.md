# SmartAgriMarket — Classes initialisées

> Arborescence complète des classes initialisées au démarrage,
> coté backend (Spring Boot) et frontend (Angular).

---

## 1. BACKEND (Spring Boot)

```
backend/
├── src/main/java/com/smartagrimarket/
│   ├── SmartAgriMarketApplication.java          ← Point d'entrée Spring Boot
│   │
│   ├── config/
│   │   ├── DataInitializer.java                 ← CommandeLineRunner (seeder données)
│   │   ├── WebConfig.java                       ← Configuration CORS / ressources statiques
│   │   └── JacksonConfig.java                   ← Module Hibernate6 pour Jackson
│   │
│   ├── security/
│   │   ├── SecurityConfig.java                  ← Configuration Spring Security
│   │   ├── JwtUtil.java                         ← Utilitaire JWT (génération, validation)
│   │   ├── JwtAuthenticationFilter.java         ← Filtre OncePerRequest (extraction token)
│   │   └── SecurityUtil.java                    ← Helper contexte de sécurité
│   │
│   ├── service/
│   │   ├── AuthService.java                     ← Inscription / connexion
│   │   ├── ProduitService.java                  ← CRUD produits + recherche filtrée
│   │   ├── CategorieService.java                ← Gestion catégories
│   │   ├── CommandeService.java                 ← Commandes, lignes, notifications
│   │   ├── UtilisateurService.java              ← Gestion utilisateurs (profil, admin)
│   │   ├── ForumService.java                    ← Articles forum + contenus apprentissage
│   │   ├── CommentaireService.java              ← Commentaires (CRUD, likes)
│   │   ├── EvaluationService.java               ← Évaluations entre utilisateurs
│   │   ├── EchangeService.java                  ← Propositions d'échange matériel
│   │   ├── AnnonceMaterielService.java          ← CRUD annonces matériel agricole
│   │   ├── MessagerieService.java               ← Conversations + filtrage coordonnées
│   │   ├── NotificationService.java             ← Notifications utilisateur
│   │   ├── LogistiqueService.java               ← Demandes livraison + suivi
│   │   ├── PrixSonagessService.java             ← Prix de référence SONAGESS
│   │   ├── ContactFilterService.java            ← Filtrage coordonnées personnelles
│   │   ├── OrderTimeoutService.java             ← Timeout commandes
│   │   └── sms/
│   │       ├── SmsService.java                  ← Interface service SMS
│   │       ├── OrangeSmsService.java            ← Implémentation Orange API
│   │       ├── LoggingSmsService.java           ← Simulation SMS (dev)
│   │       ├── CallService.java                 ← Interface service d'appel
│   │       └── LoggingCallService.java          ← Simulation d'appel (dev)
│   │
│   └── exception/
│       └── GlobalExceptionHandler.java          ← Gestion globale des erreurs (RestControllerAdvice)
```

---

### 1.1 Point d'entrée — `SmartAgriMarketApplication.java`

**Rôle** : Classe `@SpringBootApplication` qui lance le contexte Spring.

```java
package com.smartagrimarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartAgriMarketApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartAgriMarketApplication.class, args);
    }
}
```

---

### 1.2 DataInitializer — `config/DataInitializer.java`

**Rôle** : Implémente `CommandLineRunner`. Si la base est vide, insère un jeu de données
de démonstration complet : catégories, utilisateurs (admin, producteurs, acheteur,
logisticien, agent relais), cours des semences, produits, contenus d'apprentissage,
annonces matériel, articles forum, conversations, évaluations, commandes, produits
vedettes et demandes de livraison.

```java
package com.smartagrimarket.config;

import com.smartagrimarket.entity.*;
import com.smartagrimarket.entity.enums.*;
import com.smartagrimarket.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final CategorieRepository categorieRepository;
    private final CoursSemenceRepository coursSemenceRepository;
    private final ProduitRepository produitRepository;
    private final ContenuApprentissageRepository contenuApprentissageRepository;
    private final AnnonceMaterielRepository annonceMaterielRepository;
    private final ArticleForumRepository articleForumRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final EvaluationRepository evaluationRepository;
    private final CommandeRepository commandeRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final PaiementRepository paiementRepository;
    private final ProduitVedetteRepository produitVedetteRepository;
    private final DemandeLivraisonRepository demandeLivraisonRepository;
    private final SuiviLivraisonRepository suiviLivraisonRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (utilisateurRepository.count() > 0) return;

        // --- 1. Catégories ---
        List<Categorie> categories = categorieRepository.saveAll(List.of(
                Categorie.builder().nom("Fruits frais")
                        .description("Fruits de saison issus des plantations ivoiriennes").build(),
                Categorie.builder().nom("Légumes")
                        .description("Légumes frais et bio").build(),
                Categorie.builder().nom("Céréales & tubercules")
                        .description("Igname, manioc, maïs, riz local").build(),
                Categorie.builder().nom("Produits transformés")
                        .description("Jus, huiles, conserves artisanales").build(),
                Categorie.builder().nom("Volaille & élevage")
                        .description("Poulets, œufs, poissons frais").build(),
                Categorie.builder().nom("Semences & plants")
                        .description("Semences certifiées et plants maraîchers").build(),
                Categorie.builder().nom("Épices & condiments")
                        .description("Piment, gingembre, cube local").build(),
                Categorie.builder().nom("Miel & dérivés")
                        .description("Miel naturel, propolis, cire").build()
        ));

        // --- 2. Utilisateurs ---
        Utilisateur admin = utilisateurRepository.save(Utilisateur.builder()
                .nom("Admin").prenom("Admin")
                .email("admin@smartagri.com").telephone("+2250100000000")
                .motDePasse(passwordEncoder.encode("admin123"))
                .localite("Abidjan").type(TypeUtilisateur.ADMIN).estVerifie(true)
                .violationsCount(0).estSuspendu(false).build());

        Utilisateur producteur = utilisateurRepository.save(Utilisateur.builder()
                .nom("Koné").prenom("Mamadou")
                .email("producteur@smartagri.com").telephone("+2250100000001")
                .motDePasse(passwordEncoder.encode("producteur123"))
                .localite("Bouaké").type(TypeUtilisateur.PRODUCTEUR).estVerifie(true)
                .violationsCount(0).estSuspendu(false).build());

        Utilisateur acheteur = utilisateurRepository.save(Utilisateur.builder()
                .nom("Diallo").prenom("Fatou")
                .email("acheteur@smartagri.com").telephone("+2250100000002")
                .motDePasse(passwordEncoder.encode("acheteur123"))
                .localite("Abidjan").type(TypeUtilisateur.ACHETEUR).estVerifie(true)
                .violationsCount(0).estSuspendu(false).build());

        Utilisateur logisticien = utilisateurRepository.save(Utilisateur.builder()
                .nom("Traoré").prenom("Seydou")
                .email("logisticien@smartagri.com").telephone("+2250100000003")
                .motDePasse(passwordEncoder.encode("logisticien123"))
                .localite("Yamoussoukro").type(TypeUtilisateur.LOGISTIQUE).estVerifie(true)
                .violationsCount(0).estSuspendu(false).build());

        Utilisateur agentRelais = utilisateurRepository.save(Utilisateur.builder()
                .nom("N'Guessan").prenom("Aminata")
                .email("agent@smartagri.com").telephone("+2250100000004")
                .motDePasse(passwordEncoder.encode("agent123"))
                .localite("Korhogo").type(TypeUtilisateur.AGENT_RELAIS).estVerifie(true)
                .violationsCount(0).estSuspendu(false).build());

        Utilisateur producteur2 = utilisateurRepository.save(Utilisateur.builder()
                .nom("Bamba").prenom("Youssouf")
                .email("bamba@smartagri.com").telephone("+2250100000005")
                .motDePasse(passwordEncoder.encode("bamba123"))
                .localite("Daloa").type(TypeUtilisateur.PRODUCTEUR).estVerifie(true)
                .violationsCount(0).estSuspendu(false).build());

        // --- 3. Cours des semences ---
        coursSemenceRepository.saveAll(List.of(
                CoursSemence.builder().produit("Riz paddy").prix(BigDecimal.valueOf(350))
                        .localite("Bouaké").source("ANADER").build(),
                CoursSemence.builder().produit("Maïs grain").prix(BigDecimal.valueOf(250))
                        .localite("Korhogo").source("ANADER").build(),
                CoursSemence.builder().produit("Igname").prix(BigDecimal.valueOf(500))
                        .localite("Korhogo").source("OCPV").build(),
                CoursSemence.builder().produit("Manioc").prix(BigDecimal.valueOf(200))
                        .localite("Daloa").source("OCPV").build(),
                CoursSemence.builder().produit("Tomate").prix(BigDecimal.valueOf(800))
                        .localite("Abidjan").source("Marché de Gros").build(),
                CoursSemence.builder().produit("Oignon").prix(BigDecimal.valueOf(650))
                        .localite("Bouaké").source("ANADER").build(),
                CoursSemence.builder().produit("Piment frais").prix(BigDecimal.valueOf(1200))
                        .localite("Abidjan").source("Marché de Gros").build(),
                CoursSemence.builder().produit("Aubergine").prix(BigDecimal.valueOf(400))
                        .localite("Yamoussoukro").source("ANADER").build(),
                CoursSemence.builder().produit("Cacao").prix(BigDecimal.valueOf(1800))
                        .localite("Daloa").source("OCPV").build(),
                CoursSemence.builder().produit("Anacarde").prix(BigDecimal.valueOf(650))
                        .localite("Korhogo").source("OCPV").build()
        ));

        // --- 4. Produits ---
        Categorie fruits = categories.get(0);
        Categorie legumes = categories.get(1);
        Categorie cereales = categories.get(2);
        Categorie transformes = categories.get(3);
        Categorie elevage = categories.get(4);
        Categorie semences = categories.get(5);
        Categorie epices = categories.get(6);
        Categorie miel = categories.get(7);

        Produit p1 = produitRepository.save(Produit.builder()
                .titre("Banane plantain mûre")
                .description("Banane plantain bien mûre, idéale pour l'Alloco. Récolte du jour.")
                .prix(BigDecimal.valueOf(1500)).uniteVente("régime").quantiteDisponible(50)
                .categorie(fruits).localite("Bouaké").vendeur(producteur).build());

        Produit p2 = produitRepository.save(Produit.builder()
                .titre("Igname de Bondoukou")
                .description("Igname fraîchement déterrée, variété locale. Vente par tas.")
                .prix(BigDecimal.valueOf(2500)).uniteVente("tas").quantiteDisponible(30)
                .categorie(cereales).localite("Bouaké").vendeur(producteur).build());

        Produit p3 = produitRepository.save(Produit.builder()
                .titre("Tomates fraîches bio")
                .description("Tomates cultivées sans pesticides, récolte du matin. Calibre moyen.")
                .prix(BigDecimal.valueOf(1000)).uniteVente("kg").quantiteDisponible(100)
                .categorie(legumes).localite("Abidjan").vendeur(producteur2).build());

        Produit p4 = produitRepository.save(Produit.builder()
                .titre("Poulets fermiers (vivants)")
                .description("Poulets élevés en plein air, nourris au maïs local. Poids moyen 1.8 kg.")
                .prix(BigDecimal.valueOf(3500)).uniteVente("unité").quantiteDisponible(25)
                .categorie(elevage).localite("Bouaké").vendeur(producteur).build());

        Produit p5 = produitRepository.save(Produit.builder()
                .titre("Huile de palme rouge artisanale")
                .description("Huile de palme traditionnelle extraite à la main, sans conservateurs.")
                .prix(BigDecimal.valueOf(2000)).uniteVente("litre").quantiteDisponible(40)
                .categorie(transformes).localite("Daloa").vendeur(producteur2).build());

        Produit p6 = produitRepository.save(Produit.builder()
                .titre("Miel naturel de forêt")
                .description("Miel 100% naturel récolté dans la forêt de la Marahoué. Non pasteurisé.")
                .prix(BigDecimal.valueOf(4500)).uniteVente("pot 500g").quantiteDisponible(20)
                .categorie(miel).localite("Bouaké").vendeur(producteur).build());

        Produit p7 = produitRepository.save(Produit.builder()
                .titre("Manioc frais")
                .description("Manioc frais, idéal pour l'attiéké et le placali.")
                .prix(BigDecimal.valueOf(1500)).uniteVente("sac 25kg").quantiteDisponible(15)
                .categorie(cereales).localite("Daloa").vendeur(producteur2).build());

        Produit p8 = produitRepository.save(Produit.builder()
                .titre("Piment frais (variété local)")
                .description("Piment frais très piquant, idéal pour le kédjénou et les sauces.")
                .prix(BigDecimal.valueOf(500)).uniteVente("sachet").quantiteDisponible(200)
                .categorie(epices).localite("Bouaké").vendeur(producteur).build());

        Produit p9 = produitRepository.save(Produit.builder()
                .titre("Semences de maïs certifiées")
                .description("Semences de maïs sélectionnées par l'ANADER, haut rendement.")
                .prix(BigDecimal.valueOf(1800)).uniteVente("kg").quantiteDisponible(80)
                .categorie(semences).localite("Korhogo").vendeur(agentRelais).build());

        Produit p10 = produitRepository.save(Produit.builder()
                .titre("Attiéké frais")
                .description("Attiéké de qualité supérieure, prêt à consommer.")
                .prix(BigDecimal.valueOf(500)).uniteVente("sac 1kg").quantiteDisponible(60)
                .categorie(transformes).localite("Abidjan").vendeur(producteur2).build());

        Produit p11 = produitRepository.save(Produit.builder()
                .titre("Œufs de poules élevées en plein air")
                .description("Œufs frais, coquille brune, riches en oméga-3.")
                .prix(BigDecimal.valueOf(250)).uniteVente("unité").quantiteDisponible(300)
                .categorie(elevage).localite("Bouaké").vendeur(producteur).build());

        Produit p12 = produitRepository.save(Produit.builder()
                .titre("Gingembre frais")
                .description("Gingembre bio, récolté dans la région de Korhogo.")
                .prix(BigDecimal.valueOf(800)).uniteVente("kg").quantiteDisponible(40)
                .categorie(epices).localite("Korhogo").vendeur(agentRelais).build());

        Produit p13 = produitRepository.save(Produit.builder()
                .titre("Jus de bissap artisanal")
                .description("Jus de bissap pur, sans colorants ni conservateurs. Bouteille 75cl.")
                .prix(BigDecimal.valueOf(1000)).uniteVente("bouteille").quantiteDisponible(35)
                .categorie(transformes).localite("Daloa").vendeur(producteur2).build());

        Produit p14 = produitRepository.save(Produit.builder()
                .titre("Aubergines fraîches")
                .description("Aubergines violettes, calibre moyen, récolte du jour.")
                .prix(BigDecimal.valueOf(600)).uniteVente("kg").quantiteDisponible(45)
                .categorie(legumes).localite("Yamoussoukro").vendeur(admin).build());

        Produit p15 = produitRepository.save(Produit.builder()
                .titre("Noix de cajou brutes")
                .description("Noix de cajou fraîchement récoltées, séchées au soleil.")
                .prix(BigDecimal.valueOf(3000)).uniteVente("kg").quantiteDisponible(100)
                .categorie(fruits).localite("Korhogo").vendeur(agentRelais).build());

        // --- 5. Contenus d'apprentissage ---
        contenuApprentissageRepository.saveAll(List.of(
                ContenuApprentissage.builder()
                        .titre("Techniques de culture du maïs en zone tropicale")
                        .typeContenu("ARTICLE")
                        .contenu("Le maïs est une culture essentielle en Côte d'Ivoire...")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Calendrier des semis pour les cultures maraîchères")
                        .typeContenu("GUIDE")
                        .contenu("Tomate : semis en pépinière de septembre à novembre...")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Lutte biologique contre les ravageurs du cacao")
                        .typeContenu("VIDEO")
                        .contenu("La lutte biologique permet de réduire l'utilisation de pesticides...")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Transformation artisanale du manioc en attiéké")
                        .typeContenu("ARTICLE")
                        .contenu("L'attiéké est un produit phare de la cuisine ivoirienne...")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Élevage de poules pondeuses en milieu rural")
                        .typeContenu("GUIDE")
                        .contenu("Matériel nécessaire : poulailler en bambou ou parpaing...")
                        .estValide(true).validePar(admin).build()
        ));

        // --- 6. Annonces matériel ---
        annonceMaterielRepository.saveAll(List.of(
                AnnonceMateriel.builder()
                        .titre("Motoculteur Honda neuf")
                        .description("Motoculteur Honda F220, puissance 7CV, 3 vitesses avant + 1 arrière.")
                        .prix(BigDecimal.valueOf(850000)).etat(EtatMateriel.NEUF)
                        .typeTransaction(TypeTransaction.VENTE).localite("Bouaké").vendeur(producteur).build(),
                AnnonceMateriel.builder()
                        .titre("Pulvérisateur à dos 16L")
                        .description("Pulvérisateur manuel 16 litres, bon état. Utilisé une saison.")
                        .prix(BigDecimal.valueOf(15000)).etat(EtatMateriel.OCCASION)
                        .typeTransaction(TypeTransaction.VENTE).localite("Daloa").vendeur(producteur2).build(),
                AnnonceMateriel.builder()
                        .titre("Échange tracteur Mahindra contre bœufs de labour")
                        .description("Tracteur Mahindra 475 DI, 1000h, entretien à jour.")
                        .prix(null).etat(EtatMateriel.OCCASION)
                        .typeTransaction(TypeTransaction.ECHANGE).localite("Korhogo").vendeur(agentRelais).build(),
                AnnonceMateriel.builder()
                        .titre("Brouette renforcée neuve")
                        .description("Brouette professionnelle, capacité 100L, pneu plein.")
                        .prix(BigDecimal.valueOf(45000)).etat(EtatMateriel.NEUF)
                        .typeTransaction(TypeTransaction.VENTE).localite("Abidjan").vendeur(acheteur).build(),
                AnnonceMateriel.builder()
                        .titre("Filets d'ombrage pour pépinière")
                        .description("Lot de 5 filets d'ombrage 70%, 4x6m chacun. Très bon état.")
                        .prix(BigDecimal.valueOf(35000)).etat(EtatMateriel.OCCASION)
                        .typeTransaction(TypeTransaction.VENTE).localite("Yamoussoukro").vendeur(producteur).build(),
                AnnonceMateriel.builder()
                        .titre("Moulins à maïs électriques (lot de 2)")
                        .description("Deux moulins à maïs électriques, puissance 5CV chacun.")
                        .prix(BigDecimal.valueOf(250000)).etat(EtatMateriel.OCCASION)
                        .typeTransaction(TypeTransaction.VENTE).localite("Bouaké").vendeur(logisticien).build()
        ));

        // --- 7. Articles forum ---
        articleForumRepository.saveAll(List.of(
                ArticleForum.builder()
                        .titre("Prix du cacao cette saison")
                        .contenu("Bonjour à tous. Je constate que le prix du cacao a augmenté de 15%...")
                        .categorie("Marché").auteur(producteur).estModere(false).build(),
                ArticleForum.builder()
                        .titre("Conseils pour débuter en agriculture bio")
                        .contenu("Je souhaite me lancer dans l'agriculture biologique...")
                        .categorie("Conseils").auteur(acheteur).estModere(true).build(),
                ArticleForum.builder()
                        .titre("Meilleure variété d'igname pour le foutou")
                        .contenu("Entre l'igname kponan, l'igname bètè et l'igname florido...")
                        .categorie("Cultures").auteur(producteur2).estModere(false).build(),
                ArticleForum.builder()
                        .titre("Vente groupée de tomates : qui est partant ?")
                        .contenu("Nous sommes un groupe de 5 producteurs dans la région de Bouaké...")
                        .categorie("Entraide").auteur(producteur).estModere(true).build(),
                ArticleForum.builder()
                        .titre("Problème de jaunisse sur mes plants de piment")
                        .contenu("Depuis une semaine, les feuilles de mes plants de piment jaunissent...")
                        .categorie("Maladies").auteur(agentRelais).estModere(false).build(),
                ArticleForum.builder()
                        .titre("Livraison des produits agricoles : partagez vos expériences")
                        .contenu("Je perds beaucoup de produits frais pendant le transport vers Abidjan...")
                        .categorie("Logistique").auteur(producteur2).estModere(true).build(),
                ArticleForum.builder()
                        .titre("Comment obtenir un crédit agricole ?")
                        .contenu("Bonjour, je voudrais investir dans un système d'irrigation...")
                        .categorie("Financement").auteur(producteur).estModere(false).build(),
                ArticleForum.builder()
                        .titre("Recette : confiture de mangue maison")
                        .contenu("En cette saison de mangues, voici ma recette simple...")
                        .categorie("Recettes").auteur(acheteur).estModere(true).build()
        ));

        // --- 8. Conversations & messages ---
        Conversation conv1 = conversationRepository.save(Conversation.builder()
                .participants(Set.of(producteur, acheteur)).build());
        messageRepository.saveAll(List.of(
                Message.builder().conversation(conv1).expediteur(acheteur)
                        .contenu("Bonjour Mamadou, je suis intéressée par votre banane plantain...").build(),
                Message.builder().conversation(conv1).expediteur(producteur)
                        .contenu("Bonjour Fatou, oui elle est disponible. J'ai encore 50 régimes...").build(),
                Message.builder().conversation(conv1).expediteur(acheteur)
                        .contenu("Je voudrais 5 régimes pour commencer...").build(),
                Message.builder().conversation(conv1).expediteur(producteur)
                        .contenu("Je peux livrer au marché de Gros d'Adjamé...").build()
        ));

        Conversation conv2 = conversationRepository.save(Conversation.builder()
                .participants(Set.of(producteur2, logisticien)).build());
        messageRepository.saveAll(List.of(
                Message.builder().conversation(conv2).expediteur(producteur2)
                        .contenu("Bonjour Seydou, j'ai besoin de faire livrer 50 sacs de manioc...").build(),
                Message.builder().conversation(conv2).expediteur(logisticien)
                        .contenu("Bonjour Youssouf, oui bien sûr...").build()
        ));

        // --- 9. Évaluations ---
        evaluationRepository.saveAll(List.of(
                Evaluation.builder().note(5).donneur(acheteur).receveur(producteur)
                        .commentaire("Produits de très bonne qualité, livraison rapide.").build(),
                Evaluation.builder().note(4).donneur(acheteur).receveur(producteur)
                        .commentaire("Bon rapport qualité-prix.").build(),
                Evaluation.builder().note(5).donneur(producteur).receveur(acheteur)
                        .commentaire("Paiement rapide et ponctuel.").build(),
                Evaluation.builder().note(3).donneur(acheteur).receveur(producteur2)
                        .commentaire("Produit correct mais livraison un peu tardive.").build(),
                Evaluation.builder().note(4).donneur(acheteur).receveur(admin)
                        .commentaire("Bonne qualité, emballage soigné.").build()
        ));

        // --- 10. Commandes + lignes + paiements ---
        Commande cmd1 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.LIVREE)
                .montantTotal(BigDecimal.valueOf(7500))
                .fraisLivraison(BigDecimal.valueOf(2000))
                .adresseLivraison("Marché de Gros, Adjamé, Abidjan")
                .acheteur(acheteur).producteur(producteur).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd1).produit(p1).quantite(5)
                .prixUnitaire(BigDecimal.valueOf(1500)).build());
        paiementRepository.save(Paiement.builder()
                .commande(cmd1).montant(BigDecimal.valueOf(7500))
                .methode("Mobile Money").reference("MTN-20250601-001")
                .statut("PAYÉ").build());

        Commande cmd2 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.EN_PREPARATION)
                .montantTotal(BigDecimal.valueOf(14000))
                .fraisLivraison(BigDecimal.valueOf(5000))
                .adresseLivraison("Cocody, Abidjan")
                .notes("Livrer entre 14h et 16h")
                .acheteur(acheteur).producteur(producteur2).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd2).produit(p3).quantite(10)
                .prixUnitaire(BigDecimal.valueOf(1000)).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd2).produit(p10).quantite(4)
                .prixUnitaire(BigDecimal.valueOf(500)).build());
        paiementRepository.save(Paiement.builder()
                .commande(cmd2).montant(BigDecimal.valueOf(14000))
                .methode("Orange Money").reference("OM-20260620-002")
                .statut("PAYÉ").build());

        Commande cmd3 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.EN_ATTENTE)
                .montantTotal(BigDecimal.valueOf(11500))
                .fraisLivraison(BigDecimal.valueOf(3000))
                .adresseLivraison("Bouaké, quartier Sokoura")
                .acheteur(producteur2).producteur(producteur).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd3).produit(p4).quantite(2)
                .prixUnitaire(BigDecimal.valueOf(3500)).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd3).produit(p6).quantite(1)
                .prixUnitaire(BigDecimal.valueOf(4500)).build());

        // --- 11. Produits vedettes ---
        produitVedetteRepository.saveAll(List.of(
                ProduitVedette.builder().produit(p1)
                        .dateDebut(LocalDateTime.now().minusDays(2))
                        .dateFin(LocalDateTime.now().plusDays(12)).estActive(true).build(),
                ProduitVedette.builder().produit(p6)
                        .dateDebut(LocalDateTime.now().minusDays(5))
                        .dateFin(LocalDateTime.now().plusDays(9)).estActive(true).build(),
                ProduitVedette.builder().produit(p3)
                        .dateDebut(LocalDateTime.now())
                        .dateFin(LocalDateTime.now().plusDays(14)).estActive(true).build()
        ));

        // --- 12. Demandes de livraison ---
        DemandeLivraison dl1 = demandeLivraisonRepository.save(DemandeLivraison.builder()
                .commande(cmd1).adresseDepart("Bouaké, zone industrielle")
                .adresseArrivee("Adjamé, Abidjan").distanceKm(350f)
                .frais(BigDecimal.valueOf(2000)).statut("LIVRÉ")
                .partenaire(logisticien).build());
        suiviLivraisonRepository.saveAll(List.of(
                SuiviLivraison.builder().demandeLivraison(dl1).statut("PRISE_EN_CHARGE")
                        .localisation("Bouaké").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("EN_TRANSIT")
                        .localisation("Toumodi").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("ARRIVÉE")
                        .localisation("Abidjan").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("LIVRÉ")
                        .localisation("Adjamé, Abidjan").build()
        ));

        DemandeLivraison dl2 = demandeLivraisonRepository.save(DemandeLivraison.builder()
                .commande(cmd2).adresseDepart("Daloa, zone agricole")
                .adresseArrivee("Cocody, Abidjan").distanceKm(280f)
                .frais(BigDecimal.valueOf(5000)).statut("EN_TRANSIT")
                .partenaire(logisticien).build());
        suiviLivraisonRepository.saveAll(List.of(
                SuiviLivraison.builder().demandeLivraison(dl2).statut("PRISE_EN_CHARGE")
                        .localisation("Daloa").build(),
                SuiviLivraison.builder().demandeLivraison(dl2).statut("EN_TRANSIT")
                        .localisation("Yamoussoukro").build()
        ));

        System.out.println("--- SmartAgriMarket : Données de simulation insérées ---");
        System.out.printf("Catégories        : %d\n", categories.size());
        System.out.printf("Utilisateurs      : %d\n", utilisateurRepository.count());
        System.out.printf("Cours semences    : %d\n", coursSemenceRepository.count());
        System.out.printf("Produits          : %d\n", produitRepository.count());
        System.out.printf("Apprentissages    : %d\n", contenuApprentissageRepository.count());
        System.out.printf("Annonces matériel : %d\n", annonceMaterielRepository.count());
        System.out.printf("Articles forum    : %d\n", articleForumRepository.count());
        System.out.printf("Conversations     : %d\n", conversationRepository.count());
        System.out.printf("Évaluations       : %d\n", evaluationRepository.count());
        System.out.printf("Commandes         : %d\n", commandeRepository.count());
        System.out.printf("Produits vedettes : %d\n", produitVedetteRepository.count());
        System.out.printf("Demandes livraison: %d\n", demandeLivraisonRepository.count());
        System.out.println("----------------------------------------------------");
    }
}
```

---

### 1.3 WebConfig — `config/WebConfig.java`

**Rôle** : Enregistre le handler pour servir les fichiers uploadés depuis le dossier
`./uploads`.

```java
package com.smartagrimarket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = new File(uploadDir).getAbsolutePath() + "/";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath);
    }
}
```

---

### 1.4 JacksonConfig — `config/JacksonConfig.java`

**Rôle** : Ajoute le module Hibernate6 à Jackson pour éviter les erreurs de
sérialisation sur les propriétés lazy-loaded.

```java
package com.smartagrimarket.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer hibernateModuleCustomizer() {
        return builder -> builder.modulesToInstall(new Hibernate6Module());
    }
}
```

---

### 1.5 SecurityConfig — `security/SecurityConfig.java`

**Rôle** : Configure la chaîne de filtres Spring Security : CORS, CSRF désactivé,
sessions stateless, règles d'accès par endpoint, et injection du filtre JWT.

```java
package com.smartagrimarket.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/produits").permitAll()
                .requestMatchers("/api/produits/vendeur/me").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/produits/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/produits").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/produits/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/produits/**").authenticated()
                .requestMatchers("/api/categories").permitAll()
                .requestMatchers("/api/cours-semences").permitAll()
                .requestMatchers("/api/produits-vedettes").permitAll()
                .requestMatchers("/api/materiel").permitAll()
                .requestMatchers("/api/materiel/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/forum/articles").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/forum/articles/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/forum/articles").authenticated()
                .requestMatchers("/api/forum/apprentissage").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/commentaires/article/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/logistique/en-attente").authenticated()
                .requestMatchers("/api/logistique/mes-demandes").authenticated()
                .requestMatchers("/api/logistique/mes-livraisons").authenticated()
                .requestMatchers("/api/utilisateurs").authenticated()
                .requestMatchers("/api/utilisateurs/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter,
                    UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH",
                "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

---

### 1.6 JwtUtil — `security/JwtUtil.java`

**Rôle** : Génère, valide et parse les tokens JWT avec la librairie `jjwt`.
Utilise HMAC-SHA avec une clé secrète configurée via `jwt.secret`.

```java
package com.smartagrimarket.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration:86400000}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(UUID userId, String email) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public UUID getUserIdFromToken(String token) {
        return UUID.fromString(parseClaims(token).getSubject());
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

---

### 1.7 JwtAuthenticationFilter — `security/JwtAuthenticationFilter.java`

**Rôle** : Filtre `OncePerRequestFilter` qui intercepte chaque requête, extrait le
token du header `Authorization`, le valide et place l'ID utilisateur dans le
`SecurityContextHolder`.

```java
package com.smartagrimarket.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                UUID userId = jwtUtil.getUserIdFromToken(token);
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userId, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

### 1.8 SecurityUtil — `security/SecurityUtil.java`

**Rôle** : Helper utilitaire pour récupérer l'utilisateur authentifié courant depuis
le `SecurityContextHolder`.

```java
package com.smartagrimarket.security;

import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.entity.enums.TypeUtilisateur;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UtilisateurRepository utilisateurRepository;

    public UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || !(auth.getPrincipal() instanceof UUID)) {
            throw new RuntimeException("Utilisateur non authentifié");
        }
        return (UUID) auth.getPrincipal();
    }

    public UUID getCurrentUserIdOrNull() {
        try { return getCurrentUserId(); }
        catch (RuntimeException e) { return null; }
    }

    public Utilisateur getCurrentUser() {
        UUID userId = getCurrentUserId();
        return utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public void checkAdmin() {
        Utilisateur user = getCurrentUser();
        if (user.getType() != TypeUtilisateur.ADMIN) {
            throw new RuntimeException("Accès refusé : admin requis");
        }
    }
}
```

---

### 1.9 GlobalExceptionHandler — `exception/GlobalExceptionHandler.java`

**Rôle** : Intercepte les exceptions `RuntimeException` et
`MethodArgumentNotValidException` pour retourner des réponses JSON uniformes.

```java
package com.smartagrimarket.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage(),
                             "timestamp", LocalDateTime.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", errors,
                             "timestamp", LocalDateTime.now()));
    }
}
```

---

### 1.10 Services métier — `service/*.java`

Tous les services sont annotés `@Service` et instanciés au démarrage.

#### Services additionnels

| Service | Fichier | Rôle |
|---------|---------|------|
| `PrixSonagessService` | `PrixSonagessService.java` | CRUD admin des prix de référence SONAGESS |
| `ContactFilterService` | `ContactFilterService.java` | Filtrage regex des coordonnées dans les messages |
| `OrderTimeoutService` | `OrderTimeoutService.java` | Annulation automatique des commandes en attente après expiration |
| `LoggingSmsService` | `sms/LoggingSmsService.java` | Simulation SMS en développement |
| `OrangeSmsService` | `sms/OrangeSmsService.java` | Envoi SMS via API Orange |
| `LoggingCallService` | `sms/LoggingCallService.java` | Simulation d'appel en développement |

#### AuthService
**Rôle** : Inscription et connexion. Vérifie l'unicité de l'email, encode le
mot de passe avec BCrypt, et retourne un token JWT + l'utilisateur.

```java
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) { ... }
    public AuthResponse login(LoginRequest request) { ... }
}
```

#### ProduitService
**Rôle** : CRUD des produits agricoles avec recherche filtrée (keyword,
categorieId, localite, prixMin, prixMax).

```java
@Service
@RequiredArgsConstructor
public class ProduitService {
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ProduitResponse create(UUID vendeurId, ProduitRequest request) { ... }
    public Page<ProduitResponse> search(...) { ... }
    public List<ProduitResponse> getAll() { ... }
    public ProduitResponse getById(UUID id) { ... }
    public List<ProduitResponse> getByVendeur(UUID vendeurId) { ... }
    public ProduitResponse update(UUID id, ProduitRequest request) { ... }
    public void delete(UUID id) { ... }
}
```

#### CommandeService
**Rôle** : Création de commandes (valide le stock, calcule le total, notifie le
producteur), historique acheteur/producteur, mise à jour du statut avec
notification.

```java
@Service
@RequiredArgsConstructor
public class CommandeService {
    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    @Transactional
    public CommandeResponse create(UUID acheteurId, CommandeRequest request) { ... }
    public List<CommandeResponse> getByAcheteur(UUID acheteurId) { ... }
    public List<CommandeResponse> getByProducteur(UUID producteurId) { ... }
    public List<CommandeResponse> getAll() { ... }
    public CommandeResponse rembourser(UUID id) { ... }
    public CommandeResponse updateStatut(UUID id, StatutCommande statut) { ... }
}
```

#### UtilisateurService
**Rôle** : Gestion des utilisateurs (profil, admin) : lecture, mise à jour,
suppression, vérification, suspension.

```java
@Service
@RequiredArgsConstructor
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurResponse getMe(UUID id) { ... }
    public UtilisateurResponse updateMe(UUID id, UpdateUtilisateurRequest request) { ... }
    public List<UtilisateurResponse> getAll() { ... }
    public void deleteUser(UUID id) { ... }
    public UtilisateurResponse toggleVerification(UUID id) { ... }
    public UtilisateurResponse toggleSuspension(UUID id) { ... }
}
```

#### ForumService
**Rôle** : Gestion des articles du forum (création, modération, suppression) et
des contenus d'apprentissage (validation par admin).

```java
@Service
@RequiredArgsConstructor
public class ForumService {
    private final ArticleForumRepository articleForumRepository;
    private final ContenuApprentissageRepository contenuApprentissageRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ArticleForum createArticle(String titre, String contenu,
            String categorie, UUID auteurId) { ... }
    public List<ArticleForum> getAllArticles() { ... }
    public List<ArticleForum> getArticlesByCategorie(String categorie) { ... }
    public ArticleForum modererArticle(UUID id, boolean estModere) { ... }
    public void supprimerArticle(UUID id) { ... }
    public ContenuApprentissage createContenu(String titre,
            String typeContenu, String contenu) { ... }
    public List<ContenuApprentissage> getAllContenus() { ... }
    public ContenuApprentissage validerContenu(UUID id, UUID valideParId) { ... }
}
```

#### CommentaireService
**Rôle** : CRUD des commentaires sur les articles, likes/unlikes, comptage, et
récupération plate pour l'admin.

```java
@Service
@RequiredArgsConstructor
public class CommentaireService {
    private final CommentaireRepository commentaireRepository;
    private final ArticleForumRepository articleRepository;
    private final UtilisateurRepository utilisateurRepository;

    public CommentaireResponse creer(UUID auteurId, CommentaireRequest request) { ... }
    public List<CommentaireResponse> getParArticle(UUID articleId, UUID currentUserId) { ... }
    public CommentaireResponse toggleLike(UUID commentaireId, UUID userId) { ... }
    public long countParArticle(UUID articleId) { ... }
    public List<CommentaireResponse> getAllCommentaires() { ... }
}
```

#### EvaluationService
**Rôle** : Création d'évaluations entre utilisateurs (note/commentaire) et
récupération des évaluations reçues.

```java
@Service
@RequiredArgsConstructor
public class EvaluationService {
    private final EvaluationRepository evaluationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public Evaluation create(UUID donneurId, EvaluationRequest request) { ... }
    public List<Evaluation> getByReceveur(UUID receveurId) { ... }
}
```

#### EchangeService
**Rôle** : Propositions d'échange sur les annonces de matériel (avec
contre-proposition).

```java
@Service
@RequiredArgsConstructor
public class EchangeService {
    private final PropositionEchangeRepository propositionRepository;
    private final AnnonceMaterielRepository annonceRepository;
    private final UtilisateurRepository utilisateurRepository;

    public PropositionEchangeResponse proposer(UUID proposantId,
            PropositionEchangeRequest request) { ... }
    public List<PropositionEchangeResponse> getParAnnonce(UUID annonceId) { ... }
    public List<PropositionEchangeResponse> getMesPropositions(UUID proposantId) { ... }
    public PropositionEchangeResponse accepter(UUID propositionId) { ... }
    public PropositionEchangeResponse refuser(UUID propositionId) { ... }
}
```

#### AnnonceMaterielService
**Rôle** : CRUD des annonces de matériel agricole (vente ou échange).

```java
@Service
@RequiredArgsConstructor
public class AnnonceMaterielService {
    private final AnnonceMaterielRepository annonceMaterielRepository;
    private final UtilisateurRepository utilisateurRepository;

    public AnnonceMaterielResponse create(UUID vendeurId,
            AnnonceMaterielRequest request) { ... }
    public List<AnnonceMaterielResponse> getAll() { ... }
    public AnnonceMaterielResponse getById(UUID id) { ... }
    public List<AnnonceMaterielResponse> getByType(TypeTransaction type) { ... }
    public void delete(UUID id) { ... }
}
```

#### MessagerieService
**Rôle** : Messagerie entre utilisateurs avec filtrage automatique des
coordonnées personnelles (téléphone, email, URL) via regex — suspension de
l'expéditeur après 3 violations.

```java
@Service
@RequiredArgsConstructor
public class MessagerieService {
    private static final Pattern COORDONNEES_PATTERN = Pattern.compile(
        "(\\+\\d{1,3}[\\s.-]?\\d{4,14}" +
        "|0\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
        "|\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
        "|[\\w.-]+@[\\w.-]+\\.\\w{2,}" +
        "|https?://\\S+" +
        "|www\\.\\S+)"
    );

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ConversationResponse createConversation(UUID acheteurId,
            UUID producteurId, UUID produitId) { ... }
    public ConversationResponse sendMessage(UUID expediteurId,
            MessageRequest request) { ... }
    public List<ConversationResponse> getConversationsByUser(UUID userId) { ... }
}
```

#### NotificationService
**Rôle** : Création et lecture des notifications par utilisateur. Marque les
notifications comme lues individuellement ou en masse.

```java
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional
    public Notification creer(UUID utilisateurId, String titre,
            String contenu, String type, String lien) { ... }
    public List<Notification> getMesNotifications(UUID utilisateurId) { ... }
    public long getNonLues(UUID utilisateurId) { ... }
    public void marquerLue(UUID notificationId) { ... }
    public void marquerToutLu(UUID utilisateurId) { ... }
}
```

#### LogistiqueService
**Rôle** : Demandes de livraison avec estimation de distance et frais, prise en
charge par un logisticien, confirmation de livraison avec notification et suivi
des étapes.

```java
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
    public DemandeLivraison create(UUID commandeId, UUID acheteurId,
            DemandeLivraisonRequest request) { ... }
    public DemandeLivraison prendreEnCharge(UUID demandeId,
            UUID partenaireId) { ... }
    public DemandeLivraison confirmerLivraison(UUID demandeId) { ... }
    public List<SuiviLivraison> getSuivi(UUID demandeId) { ... }
    public List<DemandeLivraison> getMesDemandes(UUID userId) { ... }
    public List<DemandeLivraison> getDemandesEnAttente() { ... }
    public List<DemandeLivraison> getMesLivraisonsAssignees(UUID userId) { ... }
}
```

---

#### PrixSonagessService

**Rôle** : CRUD des prix de référence SONAGESS (Société Nationale de Gestion des Stocks de Sécurité).
Accessible en lecture publique, création/modification/suppression réservée aux administrateurs.

```java
@Service
@RequiredArgsConstructor
public class PrixSonagessService {
    private final PrixSonagessRepository prixSonagessRepository;

    public List<PrixSonagess> getAll() { ... }
    public PrixSonagess create(CreatePrixSonagessRequest request) { ... }
    public PrixSonagess update(UUID id, CreatePrixSonagessRequest request) { ... }
    public void delete(UUID id) { ... }
}
```

#### ContactFilterService

**Rôle** : Filtre les coordonnées personnelles (téléphone, email, URL) dans les messages
via regex. Remplace le contenu suspect par `[coordonnées masquées]`.

```java
@Service
public class ContactFilterService {
    private static final Pattern COORDONNEES_PATTERN = Pattern.compile(
        "(\\+\\d{1,3}[\\s.-]?\\d{4,14}" +
        "|0\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}[\\s.-]?\\d{2}" +
        "|[\\w.-]+@[\\w.-]+\\.\\w{2,}" +
        "|https?://\\S+|www\\.\\S+)"
    );

    public String filtrer(String contenu) { ... }
    public boolean contientCoordonnees(String contenu) { ... }
}
```

---

## 2. FRONTEND (Angular)

```
frontend/
└── src/app/
    ├── core/
    │   ├── models/
    │   │   ├── utilisateur.model.ts                 ← Interface Utilisateur
    │   │   ├── produit.model.ts                     ← Interface Produit
    │   │   ├── categorie.model.ts                   ← Interface Categorie
    │   │   ├── commande.model.ts                    ← Interface Commande
    │   │   ├── conversation.model.ts                ← Interface Conversation + Message
    │   │   ├── article-forum.model.ts               ← Interface ArticleForum
    │   │   ├── produit-vedette.model.ts             ← Interface ProduitVedette
    │   │   └── livraison.model.ts                   ← Interface Livraison
    │   │
    │   └── services/
    │       ├── api.service.ts                        ← Base HTTP (inject HttpClient, baseUrl)
    │       ├── auth.service.ts                       ← Auth (login, register, localStorage)
    │       ├── produit.service.ts                    ← Produits (CRUD + search filtré)
    │       ├── categorie.service.ts                  ← Catégories
    │       ├── commande.service.ts                   ← Commandes
    │       ├── panier.service.ts                     ← Panier (localStorage)
    │       ├── produit-vedette.service.ts            ← Produits vedettes
    │       ├── utilisateur.service.ts                ← Utilisateurs (profil, admin)
    │       ├── cours-semence.service.ts              ← Cours des semences
    │       ├── annonce-materiel.service.ts           ← Annonces matériel
    │       ├── forum.service.ts                      ← Forum + apprentissage
    │       ├── commentaire.service.ts                ← Commentaires
    │       ├── messagerie.service.ts                 ← Messagerie
    │       ├── notification.service.ts               ← Notifications
    │       ├── logistique.service.ts                 ← Livraison
    │       ├── evaluation.service.ts                 ← Évaluations utilisateurs
    │       ├── upload.service.ts                     ← Upload fichiers
    │       ├── admin.service.ts                      ← Admin (messages, conversations)
    │       └── prix-sonagess.service.ts              ← Prix de référence SONAGESS
    │
    ├── guards/
    │   ├── auth.guard.ts                             ← Route guard (redirige vers /connexion)
    │   ├── admin.guard.ts                            ← Vérifie rôle ADMIN
    │   └── producteur.guard.ts                       ← Vérifie rôle PRODUCTEUR
    │
    └── features/
        ├── accueil/pages/accueil.component.ts        ← Page d'accueil (catégories, vedettes)
        ├── admin/pages/admin-panel.component.ts       ← Panneau d'administration
        ├── auth/pages/login.component.ts
        ├── auth/pages/register.component.ts
        ├── forum/pages/liste/forum-liste.component.ts
        ├── forum/pages/detail/forum-detail.component.ts
        ├── forum/pages/form/forum-form.component.ts
        ├── logistique/pages/dashboard/logistique-dashboard.component.ts
        ├── logistique/pages/liste/suivi-logistique.component.ts
        ├── logistique/pages/detail/detail-logistique.component.ts
        ├── materiel/pages/liste/bourse-materiel.component.ts
        ├── materiel/pages/detail/detail-materiel.component.ts
        ├── materiel/pages/form/form-materiel.component.ts
        ├── marketplace/pages/catalogue/catalogue.component.ts
        ├── marketplace/pages/detail-produit/detail-produit.component.ts
        ├── marketplace/pages/produit-form/produit-form.component.ts
        ├── marketplace/pages/panier/panier.component.ts
        ├── marketplace/pages/commande/commande.component.ts
        ├── marketplace/pages/dashboard/dashboard.component.ts
        ├── marketplace/pages/ventes/ventes.component.ts
        ├── marketplace/pages/historique/historique-commandes.component.ts
        ├── messagerie/pages/liste-conversations.component.ts
        ├── messagerie/pages/conversation-detail.component.ts
        ├── profil/pages/profil.component.ts
        ├── onboarding/onboarding.component.ts        ← Onboarding / présentation
        ├── pwa/pwa-prompt.component.ts               ← Installation PWA
        └── layouts/main/main-layout.component.ts     ← Layout principal
```

---

### 2.1 ApiService — `core/services/api.service.ts`

**Rôle** : Classe de base pour tous les services HTTP. Injecte `HttpClient` et
fournit l'URL de base depuis `environment`.

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;
}
```

---

### 2.2 AuthService — `core/services/auth.service.ts`

**Rôle** : Gère l'authentification : inscription, connexion, déconnexion.
Sauvegarde le token et l'utilisateur dans `localStorage`. Expose un signal
`utilisateur` réactif.

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private readonly TOKEN_KEY = 'smartagri_token';
  private readonly USER_KEY = 'smartagri_user';

  utilisateur = signal<Utilisateur | null>(
    (() => {
      const saved = localStorage.getItem('smartagri_user');
      return saved ? JSON.parse(saved) : null;
    })()
  );

  constructor() {
    super();
    const u = this.utilisateur();
    if (u) this.panierService.setUserId(u.id);
  }

  register(data: { ... }): Observable<AuthResponse> { ... }
  login(data: { ... }): Observable<AuthResponse> { ... }
  logout() { ... }
  get token(): string | null { ... }
  get isLoggedIn(): boolean { ... }
}
```

---

### 2.3 PanierService — `core/services/panier.service.ts`

**Rôle** : Gère le panier dans `localStorage`, associé à l'ID utilisateur
(persiste par utilisateur, ou anonyme).

```typescript
@Injectable({ providedIn: 'root' })
export class PanierService {
  private items = new BehaviorSubject<PanierItem[]>([]);
  private userId: string | null = null;

  constructor() {
    const saved = localStorage.getItem('smartagri_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.userId = user.id || null;
      } catch { this.userId = null; }
    }
    this.items.next(this.load());
  }

  setUserId(userId: string | null) { ... }
  getItems(): Observable<PanierItem[]> { ... }
  getSnapshot(): PanierItem[] { ... }
  add(produit: Produit, quantite = 1) { ... }
  updateQuantite(produitId: string, quantite: number) { ... }
  remove(produitId: string) { ... }
  clear() { ... }
  get total(): number { ... }
  get count(): number { ... }
}
```

---

### 2.4 ProduitService — `core/services/produit.service.ts`

**Rôle** : CRUD des produits + recherche paginée avec filtres (keyword,
categorieId, localite, prixMin, prixMax).

```typescript
export interface ProduitSearchParams {
  keyword?: string;
  categorieId?: string;
  localite?: string;
  prixMin?: number;
  prixMax?: number;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ProduitService extends ApiService {
  search(params: ProduitSearchParams): Observable<PageResponse<Produit>> { ... }
  getById(id: string): Observable<Produit> { ... }
  getByVendeur(vendeurId: string): Observable<Produit[]> { ... }
  getMesProduits(): Observable<Produit[]> { ... }
  create(data: Partial<Produit>): Observable<Produit> { ... }
  update(id: string, data: Partial<Produit>): Observable<Produit> { ... }
  delete(id: string): Observable<void> { ... }
}
```

---

### 2.5 Autres services (`providedIn: 'root'`)

| Service | Fichier | Rôle |
|---------|---------|------|
| `CategorieService` | `categorie.service.ts` | Récupère toutes les catégories |
| `CommandeService` | `commande.service.ts` | CRUD commandes + statut + paiement |
| `ProduitVedetteService` | `produit-vedette.service.ts` | Produits mis en avant |
| `UtilisateurService` | `utilisateur.service.ts` | Profil + admin utilisateurs |
| `CoursSemenceService` | `cours-semence.service.ts` | Cours du marché par localité |
| `AnnonceMaterielService` | `annonce-materiel.service.ts` | CRUD annonces matériel |
| `EchangeService` | `echange.service.ts` | Propositions d'échange matériel |
| `ForumService` | `forum.service.ts` | Articles forum + contenus |
| `CommentaireService` | `commentaire.service.ts` | Commentaires + likes |
| `MessagerieService` | `messagerie.service.ts` | Conversations + messages |
| `NotificationService` | `notification.service.ts` | Notifications + compteur |
| `LogistiqueService` | `logistique.service.ts` | Livraisons + suivi |
| `EvaluationService` | `evaluation.service.ts` | Évaluations entre utilisateurs |
| `UploadService` | `upload.service.ts` | Upload fichiers images |
| `AdminService` | `admin.service.ts` | Modération (messages, commentaires, contenus) |
| `PrixSonagessService` | `prix-sonagess.service.ts` | Prix de référence SONAGESS |

---

### 2.6 AuthGuard — `core/guards/auth.guard.ts`

**Rôle** : Protège les routes nécessitant une authentification. Redirige vers
`/connexion` si non connecté.

```typescript
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn) return true;
  return router.parseUrl('/connexion');
};
```

---

### 2.7 MainLayoutComponent — `layouts/main/main-layout.component.ts`

**Rôle** : Layout principal de l'application. Initialise le compteur du panier
et charge les notifications toutes les 30 secondes si l'utilisateur est
connecté.

```typescript
export class MainLayoutComponent implements OnInit {
  notifications: Notification[] = [];
  nonLues = 0;
  showNotifications = false;
  panierCount = 0;

  ngOnInit() {
    this.panierService.getItems().subscribe(items => {
      this.panierCount = items.reduce((sum, i) => sum + i.quantite, 0);
    });
    if (this.auth.isLoggedIn) {
      this.chargerNotifications();
      setInterval(() => this.chargerNotifications(), 30000);
    }
  }

  chargerNotifications() { ... }
  toggleNotifications() { ... }
  marquerLue(n: Notification) { ... }
  marquerToutLu() { ... }
  deconnexion() { ... }
  isActive(path: string): boolean { ... }
}
```

---

### 2.8 AccueilComponent — `features/accueil/pages/accueil.component.ts`

**Rôle** : Page d'accueil. Initialise les catégories, produits vedettes, cours
des semences et derniers produits. Gère les animations IntersectionObserver.

```typescript
export class AccueilComponent implements OnInit, AfterViewInit {
  categories: Categorie[] = [];
  produitsVedettes: ProduitVedette[] = [];
  coursSemences: CoursSemence[] = [];
  derniersProduits: Produit[] = [];
  searchQuery = '';
  semenceFilter = '';
  visible = false;

  ngOnInit() {
    this.categorieService.getAll().subscribe(data => this.categories = data);
    this.produitVedetteService.getActifs()
        .subscribe(data => this.produitsVedettes = data);
    this.coursSemenceService.getAll()
        .subscribe(data => this.coursSemences = data);
    this.produitService.search({ page: 0, size: 8 })
        .subscribe((res: PageResponse<Produit>) => {
      this.derniersProduits = res.content.reverse();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.visible = true, 100);
    this.setupScrollAnimations();
  }

  get filteredSemences(): CoursSemence[] { ... }
  get uniqueLocalites(): string[] { ... }
  getCategoryIcon(nom: string): string { ... }
}
```

---

### 2.9 CatalogueComponent — `features/marketplace/pages/catalogue/catalogue.component.ts`

**Rôle** : Catalogue des produits. Charge les catégories puis lit le query param
`categorieId` pour filtrer automatiquement les produits. Supporte la pagination
et les filtres.

```typescript
export class CatalogueComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  page = 0;
  totalPages = 0;
  keyword = '';
  selectedCategorie = '';
  localite = '';
  prixMin?: number;
  prixMax?: number;

  ngOnInit() {
    this.categorieService.getAll().subscribe(data => {
      this.categories = data;
      this.route.queryParams.subscribe(params => {
        const catId = params['categorieId'];
        if (catId && this.categories.some(c => c.id === catId)) {
          this.selectedCategorie = catId;
        }
        this.search();
      });
    });
  }

  search() {
    const params: ProduitSearchParams = { page: this.page, size: 20 };
    if (this.keyword) params.keyword = this.keyword;
    if (this.selectedCategorie) params.categorieId = this.selectedCategorie;
    if (this.localite) params.localite = this.localite;
    if (this.prixMin) params.prixMin = this.prixMin;
    if (this.prixMax) params.prixMax = this.prixMax;
    this.produitService.search(params).subscribe(...);
  }

  onSearch() { this.page = 0; this.search(); }
  prevPage() { ... }
  nextPage() { ... }
  resetFilters() { ... }
}
```

---

## Résumé

| Couche | Type | Quantité | Détail |
|--------|------|----------|--------|
| **Backend** | `@SpringBootApplication` | 1 | Point d'entrée Spring Boot |
| **Backend** | `@Configuration` | 3 | Web, Jackson, Security |
| **Backend** | `@Component` / `CommandLineRunner` | 1 | DataInitializer (seeder) |
| **Backend** | `@Component` (filtre, utils) | 3 | JwtUtil, JwtFilter, SecurityUtil |
| **Backend** | `@Service` | 15 | Services métier (pr. 5 sous-services SMS) |
| **Backend** | `@RestController` | 19 | Contrôleurs REST |
| **Backend** | `@RestControllerAdvice` | 1 | GlobalExceptionHandler |
| **Backend** | Entités JPA | 21 | Entities + 4 enums |
| **Backend** | DTOs | 24 | Data Transfer Objects |
| **Frontend** | `@Injectable({ providedIn: 'root' })` | 16 | Services Angular (singletons) |
| **Frontend** | Components with `ngOnInit` | ~25 | Pages et layouts |
| **Frontend** | Route guards | 3 | `authGuard`, `adminGuard`, `producteurGuard` |
| **Frontend** | Interfaces/Models | 8 | Types TypeScript |

> Fichier mis à jour le 06/07/2026 — SmartAgriMarket
