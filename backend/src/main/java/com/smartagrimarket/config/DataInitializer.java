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
                Categorie.builder().nom("Fruits frais").description("Fruits de saison issus des plantations ivoiriennes").build(),
                Categorie.builder().nom("Légumes").description("Légumes frais et bio").build(),
                Categorie.builder().nom("Céréales & tubercules").description("Igname, manioc, maïs, riz local").build(),
                Categorie.builder().nom("Produits transformés").description("Jus, huiles, conserves artisanales").build(),
                Categorie.builder().nom("Volaille & élevage").description("Poulets, œufs, poissons frais").build(),
                Categorie.builder().nom("Semences & plants").description("Semences certifiées et plants maraîchers").build(),
                Categorie.builder().nom("Épices & condiments").description("Piment, gingembre, cube local").build(),
                Categorie.builder().nom("Miel & dérivés").description("Miel naturel, propolis, cire").build()
        ));

        // --- 2. Utilisateurs ---
        Utilisateur admin = utilisateurRepository.save(Utilisateur.builder()
                .nom("Admin").prenom("Admin")
                .email("admin@smartagri.com").telephone("+2250100000000")
                .motDePasse(passwordEncoder.encode("admin123"))
                .localite("Abidjan").type(TypeUtilisateur.ADMIN).estVerifie(true).build());

        Utilisateur producteur = utilisateurRepository.save(Utilisateur.builder()
                .nom("Koné").prenom("Mamadou")
                .email("producteur@smartagri.com").telephone("+2250100000001")
                .motDePasse(passwordEncoder.encode("producteur123"))
                .localite("Bouaké").type(TypeUtilisateur.PRODUCTEUR).estVerifie(true).build());

        Utilisateur acheteur = utilisateurRepository.save(Utilisateur.builder()
                .nom("Diallo").prenom("Fatou")
                .email("acheteur@smartagri.com").telephone("+2250100000002")
                .motDePasse(passwordEncoder.encode("acheteur123"))
                .localite("Abidjan").type(TypeUtilisateur.ACHETEUR).estVerifie(true).build());

        Utilisateur logisticien = utilisateurRepository.save(Utilisateur.builder()
                .nom("Traoré").prenom("Seydou")
                .email("logisticien@smartagri.com").telephone("+2250100000003")
                .motDePasse(passwordEncoder.encode("logisticien123"))
                .localite("Yamoussoukro").type(TypeUtilisateur.LOGISTIQUE).estVerifie(true).build());

        Utilisateur agentRelais = utilisateurRepository.save(Utilisateur.builder()
                .nom("N'Guessan").prenom("Aminata")
                .email("agent@smartagri.com").telephone("+2250100000004")
                .motDePasse(passwordEncoder.encode("agent123"))
                .localite("Korhogo").type(TypeUtilisateur.AGENT_RELAIS).estVerifie(true).build());

        Utilisateur producteur2 = utilisateurRepository.save(Utilisateur.builder()
                .nom("Bamba").prenom("Youssouf")
                .email("bamba@smartagri.com").telephone("+2250100000005")
                .motDePasse(passwordEncoder.encode("bamba123"))
                .localite("Daloa").type(TypeUtilisateur.PRODUCTEUR).estVerifie(true).build());

        // --- 3. Cours des semences ---
        coursSemenceRepository.saveAll(List.of(
                CoursSemence.builder().produit("Riz paddy").prix(BigDecimal.valueOf(350)).localite("Bouaké").source("ANADER").build(),
                CoursSemence.builder().produit("Maïs grain").prix(BigDecimal.valueOf(250)).localite("Korhogo").source("ANADER").build(),
                CoursSemence.builder().produit("Igname").prix(BigDecimal.valueOf(500)).localite("Korhogo").source("OCPV").build(),
                CoursSemence.builder().produit("Manioc").prix(BigDecimal.valueOf(200)).localite("Daloa").source("OCPV").build(),
                CoursSemence.builder().produit("Tomate").prix(BigDecimal.valueOf(800)).localite("Abidjan").source("Marché de Gros").build(),
                CoursSemence.builder().produit("Oignon").prix(BigDecimal.valueOf(650)).localite("Bouaké").source("ANADER").build(),
                CoursSemence.builder().produit("Piment frais").prix(BigDecimal.valueOf(1200)).localite("Abidjan").source("Marché de Gros").build(),
                CoursSemence.builder().produit("Aubergine").prix(BigDecimal.valueOf(400)).localite("Yamoussoukro").source("ANADER").build(),
                CoursSemence.builder().produit("Cacao").prix(BigDecimal.valueOf(1800)).localite("Daloa").source("OCPV").build(),
                CoursSemence.builder().produit("Anacarde").prix(BigDecimal.valueOf(650)).localite("Korhogo").source("OCPV").build()
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
                .titre("Banane plantain mûre").description("Banane plantain bien mûre, idéale pour l'Alloco. Récolte du jour.")
                .prix(BigDecimal.valueOf(1500)).uniteVente("régime").quantiteDisponible(50)
                .categorie(fruits).localite("Bouaké").vendeur(producteur).build());

        Produit p2 = produitRepository.save(Produit.builder()
                .titre("Igname de Bondoukou").description("Igname fraîchement déterrée, variété locale. Vente par tas.")
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
                .titre("Manioc frais").description("Manioc frais, idéal pour l'attiéké et le placali.")
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
                .titre("Attiéké frais").description("Attiéké de qualité supérieure, prêt à consommer.")
                .prix(BigDecimal.valueOf(500)).uniteVente("sac 1kg").quantiteDisponible(60)
                .categorie(transformes).localite("Abidjan").vendeur(producteur2).build());

        Produit p11 = produitRepository.save(Produit.builder()
                .titre("Œufs de poules élevées en plein air")
                .description("Œufs frais, coquille brune, riches en oméga-3.")
                .prix(BigDecimal.valueOf(250)).uniteVente("unité").quantiteDisponible(300)
                .categorie(elevage).localite("Bouaké").vendeur(producteur).build());

        Produit p12 = produitRepository.save(Produit.builder()
                .titre("Gingembre frais").description("Gingembre bio, récolté dans la région de Korhogo.")
                .prix(BigDecimal.valueOf(800)).uniteVente("kg").quantiteDisponible(40)
                .categorie(epices).localite("Korhogo").vendeur(agentRelais).build());

        Produit p13 = produitRepository.save(Produit.builder()
                .titre("Jus de bissap artisanal")
                .description("Jus de bissap pur, sans colorants ni conservateurs. Bouteille 75cl.")
                .prix(BigDecimal.valueOf(1000)).uniteVente("bouteille").quantiteDisponible(35)
                .categorie(transformes).localite("Daloa").vendeur(producteur2).build());

        Produit p14 = produitRepository.save(Produit.builder()
                .titre("Aubergines fraîches").description("Aubergines violettes, calibre moyen, récolte du jour.")
                .prix(BigDecimal.valueOf(600)).uniteVente("kg").quantiteDisponible(45)
                .categorie(legumes).localite("Yamoussoukro").vendeur(admin).build());

        Produit p15 = produitRepository.save(Produit.builder()
                .titre("Noix de cajou brutes").description("Noix de cajou fraîchement récoltées, séchées au soleil.")
                .prix(BigDecimal.valueOf(3000)).uniteVente("kg").quantiteDisponible(100)
                .categorie(fruits).localite("Korhogo").vendeur(agentRelais).build());

        // --- 5. Contenus d'apprentissage ---
        contenuApprentissageRepository.saveAll(List.of(
                ContenuApprentissage.builder()
                        .titre("Techniques de culture du maïs en zone tropicale")
                        .typeContenu("ARTICLE")
                        .contenu("Le maïs est une culture essentielle en Côte d'Ivoire. Pour un rendement optimal, il faut préparer le sol 2 semaines avant les premières pluies, espacer les semis de 80 cm entre les lignes et 40 cm sur la ligne, et appliquer un engrais NPK au 15e jour après semis. Les variétés locales offrent une meilleure résistance à la sécheresse.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Calendrier des semis pour les cultures maraîchères")
                        .typeContenu("GUIDE")
                        .contenu("Tomate : semis en pépinière de septembre à novembre, repiquage à 30 jours. Aubergine : semis de février à avril, récolte à 90 jours. Piment : semis toute l'année en zone forestière, récolte à 75 jours. Conseils : arroser matin et soir en saison sèche, pailler le sol pour conserver l'humidité.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Lutte biologique contre les ravageurs du cacao")
                        .typeContenu("VIDEO")
                        .contenu("La lutte biologique permet de réduire l'utilisation de pesticides chimiques. Les principaux ennemis du cacaoyer sont les mirides et les pourridiés. Solutions naturelles : extraits de neem, introduction de fourmis rouges, champignons entomopathogènes. Le suivi régulier des parcelles est essentiel pour une détection précoce.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Transformation artisanale du manioc en attiéké")
                        .typeContenu("ARTICLE")
                        .contenu("L'attiéké est un produit phare de la cuisine ivoirienne. Étapes : épluchage et lavage des tubercules, râpage mécanique ou manuel, fermentation 24h avec le sel, pressage pour extraire l'eau, séchage au soleil ou toastage, cuisson à la vapeur 20 minutes. L'attiéké de qualité se conserve 3 jours au frais.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Élevage de poules pondeuses en milieu rural")
                        .typeContenu("GUIDE")
                        .contenu("Matériel nécessaire : poulailler en bambou ou parpaing, abreuvoirs, pondoirs. Alimentation : maïs concassé (60%), son de riz (20%), compléments protéiques (20%). Production : une poule pond en moyenne 250 œufs par an. Prévention : vaccination contre la maladie de Newcastle, nettoyage hebdomadaire du poulailler.")
                        .estValide(true).validePar(admin).build()
        ));

        // --- 6. Annonces matériel ---
        annonceMaterielRepository.saveAll(List.of(
                AnnonceMateriel.builder()
                        .titre("Motoculteur Honda neuf").description("Motoculteur Honda F220, puissance 7CV, 3 vitesses avant + 1 arrière. Garantie 2 ans.")
                        .prix(BigDecimal.valueOf(850000)).etat(EtatMateriel.NEUF).typeTransaction(TypeTransaction.VENTE)
                        .localite("Bouaké").vendeur(producteur).build(),
                AnnonceMateriel.builder()
                        .titre("Pulvérisateur à dos 16L").description("Pulvérisateur manuel 16 litres, bon état. Utilisé une saison.")
                        .prix(BigDecimal.valueOf(15000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.VENTE)
                        .localite("Daloa").vendeur(producteur2).build(),
                AnnonceMateriel.builder()
                        .titre("Échange tracteur Mahindra contre bœufs de labour")
                        .description("Tracteur Mahindra 475 DI, 1000h, entretien à jour. Cherche 4 bœufs de labour en échange.")
                        .prix(null).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.ECHANGE)
                        .localite("Korhogo").vendeur(agentRelais).build(),
                AnnonceMateriel.builder()
                        .titre("Brouette renforcée neuve").description("Brouette professionnelle, capacité 100L, pneu plein. Idéale pour chantier agricole.")
                        .prix(BigDecimal.valueOf(45000)).etat(EtatMateriel.NEUF).typeTransaction(TypeTransaction.VENTE)
                        .localite("Abidjan").vendeur(acheteur).build(),
                AnnonceMateriel.builder()
                        .titre("Filets d'ombrage pour pépinière").description("Lot de 5 filets d'ombrage 70%, 4x6m chacun. Très bon état.")
                        .prix(BigDecimal.valueOf(35000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.VENTE)
                        .localite("Yamoussoukro").vendeur(producteur).build(),
                AnnonceMateriel.builder()
                        .titre("Moulins à maïs électriques (lot de 2)")
                        .description("Deux moulins à maïs électriques, puissance 5CV chacun. Fonctionnent au groupe électrogène.")
                        .prix(BigDecimal.valueOf(250000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.VENTE)
                        .localite("Bouaké").vendeur(logisticien).build()
        ));

        // --- 7. Articles forum ---
        articleForumRepository.saveAll(List.of(
                ArticleForum.builder().titre("Prix du cacao cette saison")
                        .contenu("Bonjour à tous. Je constate que le prix du cacao a augmenté de 15% cette semaine. Est-ce que d'autres producteurs observent la même tendance dans leur région ? Discussions autour des cours actuels et perspectives.")
                        .categorie("Marché").auteur(producteur).estModere(false).build(),
                ArticleForum.builder().titre("Conseils pour débuter en agriculture bio")
                        .contenu("Je souhaite me lancer dans l'agriculture biologique sur un terrain de 2 hectares près d'Abidjan. Quelles sont les premières étapes ? Faut-il une certification ? Merci pour vos conseils d'experts.")
                        .categorie("Conseils").auteur(acheteur).estModere(true).build(),
                ArticleForum.builder().titre("Meilleure variété d'igname pour le foutou")
                        .contenu("Entre l'igname kponan, l'igname bètè et l'igname florido, quelle est la meilleure variété pour faire du foutou ? Je cherche une variété qui donne une texture à la fois ferme et élastique. Retours d'expérience bienvenus.")
                        .categorie("Cultures").auteur(producteur2).estModere(false).build(),
                ArticleForum.builder().titre("Vente groupée de tomates : qui est partant ?")
                        .contenu("Nous sommes un groupe de 5 producteurs dans la région de Bouaké et nous cherchons à mutualiser la vente de nos tomates pour négocier de meilleurs prix avec les acheteurs d'Abidjan. Si d'autres producteurs sont intéressés, contactez-moi.")
                        .categorie("Entraide").auteur(producteur).estModere(true).build(),
                ArticleForum.builder().titre("Problème de jaunisse sur mes plants de piment")
                        .contenu("Depuis une semaine, les feuilles de mes plants de piment jaunissent et certaines tombent. J'ai essayé le purin d'ortie mais ça ne semble pas fonctionner. Quelqu'un a déjà rencontré ce problème ?")
                        .categorie("Maladies").auteur(agentRelais).estModere(false).build(),
                ArticleForum.builder().titre("Livraison des produits agricoles : partagez vos expériences")
                        .contenu("Je perds beaucoup de produits frais pendant le transport vers Abidjan. Comment faites-vous pour conserver la fraîcheur de vos légumes ? Utilisez-vous des véhicules réfrigérés ou d'autres méthodes ?")
                        .categorie("Logistique").auteur(producteur2).estModere(true).build(),
                ArticleForum.builder().titre("Comment obtenir un crédit agricole ?")
                        .contenu("Bonjour, je voudrais investir dans un système d'irrigation goutte-à-goutte pour ma plantation de tomates. Quelles sont les banques ou microfinances qui proposent des crédits adaptés aux petits producteurs ? Quels sont les taux pratiqués ?")
                        .categorie("Financement").auteur(producteur).estModere(false).build(),
                ArticleForum.builder().titre("Recette : confiture de mangue maison")
                        .contenu("En cette saison de mangues, voici ma recette simple : 1 kg de mangue bien mûre, 500g de sucre, un jus de citron. Faire cuire 45 minutes à feu doux en remuant. Se conserve 6 mois au frais. Idéal pour valoriser les invendus.")
                        .categorie("Recettes").auteur(acheteur).estModere(true).build()
        ));

        // --- 8. Conversations & messages ---
        Conversation conv1 = conversationRepository.save(Conversation.builder()
                .participants(Set.of(producteur, acheteur)).build());
        messageRepository.saveAll(List.of(
                Message.builder().conversation(conv1).expediteur(acheteur)
                        .contenu("Bonjour Mamadou, je suis intéressée par votre banane plantain. Est-elle encore disponible ?").build(),
                Message.builder().conversation(conv1).expediteur(producteur)
                        .contenu("Bonjour Fatou, oui elle est disponible. J'ai encore 50 régimes. Combien vous en faut-il ?").build(),
                Message.builder().conversation(conv1).expediteur(acheteur)
                        .contenu("Je voudrais 5 régimes pour commencer. Est-ce que vous livrez à Abidjan ?").build(),
                Message.builder().conversation(conv1).expediteur(producteur)
                        .contenu("Je peux livrer au marché de Gros d'Adjamé si vous voulez. On se retrouve samedi matin ?").build()
        ));

        Conversation conv2 = conversationRepository.save(Conversation.builder()
                .participants(Set.of(producteur2, logisticien)).build());
        messageRepository.saveAll(List.of(
                Message.builder().conversation(conv2).expediteur(producteur2)
                        .contenu("Bonjour Seydou, j'ai besoin de faire livrer 50 sacs de manioc de Daloa à Abidjan. Pouvez-vous me faire un devis ?").build(),
                Message.builder().conversation(conv2).expediteur(logisticien)
                        .contenu("Bonjour Youssouf, oui bien sûr. Pour 50 sacs de 25 kg, comptez environ 75 000 FCFA. Le transport prend 2 jours. Vous voulez qu'on programme ça ?").build()
        ));

        // --- 9. Évaluations ---
        evaluationRepository.saveAll(List.of(
                Evaluation.builder().note(5).donneur(acheteur).receveur(producteur)
                        .commentaire("Produits de très bonne qualité, livraison rapide. Je recommande !").build(),
                Evaluation.builder().note(4).donneur(acheteur).receveur(producteur)
                        .commentaire("Bon rapport qualité-prix. Les bananes étaient bien mûres.").build(),
                Evaluation.builder().note(5).donneur(producteur).receveur(acheteur)
                        .commentaire("Paiement rapide et ponctuel. Bonne communication.").build(),
                Evaluation.builder().note(3).donneur(acheteur).receveur(producteur2)
                        .commentaire("Produit correct mais livraison un peu tardive.").build(),
                Evaluation.builder().note(4).donneur(acheteur).receveur(admin)
                        .commentaire("Bonne qualité, emballage soigné. À refaire.").build()
        ));

        // --- 10. Commandes + lignes + paiements ---
        Commande cmd1 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.LIVREE)
                .montantTotal(BigDecimal.valueOf(7500))
                .fraisLivraison(BigDecimal.valueOf(2000))
                .adresseLivraison("Marché de Gros, Adjamé, Abidjan")
                .acheteur(acheteur).producteur(producteur).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd1).produit(p1).quantite(5).prixUnitaire(BigDecimal.valueOf(1500)).build());
        paiementRepository.save(Paiement.builder()
                .commande(cmd1).montant(BigDecimal.valueOf(7500))
                .methode("Mobile Money").reference("MTN-20250601-001")
                .statut("PAYÉ").build());

        Commande cmd2 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.EN_PREPARATION)
                .montantTotal(BigDecimal.valueOf(14000))
                .fraisLivraison(BigDecimal.valueOf(5000))
                .adresseLivraison("Cocody, Abidjan")
                .notes("Livrer entre 14h et 16h").acheteur(acheteur).producteur(producteur2).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd2).produit(p3).quantite(10).prixUnitaire(BigDecimal.valueOf(1000)).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd2).produit(p10).quantite(4).prixUnitaire(BigDecimal.valueOf(500)).build());
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
                .commande(cmd3).produit(p4).quantite(2).prixUnitaire(BigDecimal.valueOf(3500)).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd3).produit(p6).quantite(1).prixUnitaire(BigDecimal.valueOf(4500)).build());

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
                SuiviLivraison.builder().demandeLivraison(dl1).statut("PRISE_EN_CHARGE").localisation("Bouaké").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("EN_TRANSIT").localisation("Toumodi").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("ARRIVÉE").localisation("Abidjan").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("LIVRÉ").localisation("Adjamé, Abidjan").build()
        ));

        DemandeLivraison dl2 = demandeLivraisonRepository.save(DemandeLivraison.builder()
                .commande(cmd2).adresseDepart("Daloa, zone agricole")
                .adresseArrivee("Cocody, Abidjan").distanceKm(280f)
                .frais(BigDecimal.valueOf(5000)).statut("EN_TRANSIT")
                .partenaire(logisticien).build());
        suiviLivraisonRepository.saveAll(List.of(
                SuiviLivraison.builder().demandeLivraison(dl2).statut("PRISE_EN_CHARGE").localisation("Daloa").build(),
                SuiviLivraison.builder().demandeLivraison(dl2).statut("EN_TRANSIT").localisation("Yamoussoukro").build()
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
