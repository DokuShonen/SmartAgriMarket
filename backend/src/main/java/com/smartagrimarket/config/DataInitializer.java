package com.smartagrimarket.config;

import com.smartagrimarket.entity.*;
import com.smartagrimarket.entity.enums.*;
import com.smartagrimarket.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    private final ParametreRepository parametreRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (utilisateurRepository.count() > 0) return;

        // ============================================================
        // 1. Catégories
        // ============================================================
        List<Categorie> categories = categorieRepository.saveAll(List.of(
                Categorie.builder().nom("Fruits frais").description("Fruits de saison issus des vergers et plantations locales").build(),
                Categorie.builder().nom("Légumes").description("Légumes frais du maraîchage, récoltés à maturité").build(),
                Categorie.builder().nom("Céréales & tubercules").description("Igname, manioc, maïs, riz et autres féculents").build(),
                Categorie.builder().nom("Produits transformés").description("Jus, huiles et conserves artisanales").build(),
                Categorie.builder().nom("Volaille & élevage").description("Poulets, œufs et produits de l'élevage local").build(),
                Categorie.builder().nom("Semences & plants").description("Semences certifiées et plants maraîchers sélectionnés").build(),
                Categorie.builder().nom("Épices & condiments").description("Piment, gingembre et aromates du terroir").build(),
                Categorie.builder().nom("Miel & dérivés").description("Miel naturel, propolis et cire d'abeille").build()
        ));
        Categorie fruits = categories.get(0);
        Categorie legumes = categories.get(1);
        Categorie cereales = categories.get(2);
        Categorie transformes = categories.get(3);
        Categorie elevage = categories.get(4);
        Categorie semences = categories.get(5);
        Categorie epices = categories.get(6);
        Categorie miel = categories.get(7);

        // ============================================================
        // 2. Comptes (conservés pour la connexion)
        // ============================================================
        String[] pseudos = {"Agri4827", "Fermier9153", "Paysan6371", "Champ2048", "Semailles7891", "Recolte3562", "Jardin1234", "Culture5678", "Semailles9012"};
        int pi = 0;

        Utilisateur admin = utilisateurRepository.save(Utilisateur.builder()
                .nom("Admin").prenom("Admin")
                .email("admin@smartagri.com").telephone("+2260100000000")
                .motDePasse(passwordEncoder.encode("admin123"))
                .localite("Ouagadougou").type(TypeUtilisateur.ADMIN).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        utilisateurRepository.save(Utilisateur.builder()
                .nom("Modo-Forum").prenom("Alice")
                .email("modo-forum@smartagri.com").telephone("+2260100000100")
                .motDePasse(passwordEncoder.encode("modo123"))
                .localite("Ouagadougou").type(TypeUtilisateur.ADMIN).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        utilisateurRepository.save(Utilisateur.builder()
                .nom("Modo-Support").prenom("Bob")
                .email("modo-support@smartagri.com").telephone("+2260100000101")
                .motDePasse(passwordEncoder.encode("modo123"))
                .localite("Ouagadougou").type(TypeUtilisateur.MODERATION_SUPPORT).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        utilisateurRepository.save(Utilisateur.builder()
                .nom("Admin-Tech").prenom("Charlie")
                .email("tech@smartagri.com").telephone("+2260100000102")
                .motDePasse(passwordEncoder.encode("tech123"))
                .localite("Ouagadougou").type(TypeUtilisateur.SUPER_ADMIN).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        Utilisateur producteur = utilisateurRepository.save(Utilisateur.builder()
                .nom("Koné").prenom("Mamadou")
                .email("producteur@smartagri.com").telephone("+2260100000001")
                .motDePasse(passwordEncoder.encode("producteur123"))
                .localite("Bobo-Dioulasso").type(TypeUtilisateur.PRODUCTEUR).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        Utilisateur acheteur = utilisateurRepository.save(Utilisateur.builder()
                .nom("Diallo").prenom("Fatou")
                .email("acheteur@smartagri.com").telephone("+2260100000002")
                .motDePasse(passwordEncoder.encode("acheteur123"))
                .localite("Ouagadougou").type(TypeUtilisateur.ACHETEUR).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        Utilisateur logisticien = utilisateurRepository.save(Utilisateur.builder()
                .nom("Traoré").prenom("Seydou")
                .email("logisticien@smartagri.com").telephone("+2260100000003")
                .motDePasse(passwordEncoder.encode("logisticien123"))
                .localite("Banfora").type(TypeUtilisateur.LOGISTIQUE).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        Utilisateur agentRelais = utilisateurRepository.save(Utilisateur.builder()
                .nom("N'Guessan").prenom("Aminata")
                .email("agent@smartagri.com").telephone("+2260100000004")
                .motDePasse(passwordEncoder.encode("agent123"))
                .localite("Ouahigouya").type(TypeUtilisateur.AGENT_RELAIS).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        Utilisateur producteur2 = utilisateurRepository.save(Utilisateur.builder()
                .nom("Bamba").prenom("Youssouf")
                .email("bamba@smartagri.com").telephone("+2260100000005")
                .motDePasse(passwordEncoder.encode("bamba123"))
                .localite("Koudougou").type(TypeUtilisateur.PRODUCTEUR).estVerifie(true)
                .violationsCount(0).estSuspendu(false).pseudoForum(pseudos[pi++]).build());

        // ============================================================
        // 3. Cours des semences (prix de référence)
        // ============================================================
        coursSemenceRepository.saveAll(List.of(
                CoursSemence.builder().produit("Riz paddy").prix(BigDecimal.valueOf(350)).localite("Bobo-Dioulasso").source("INERA").build(),
                CoursSemence.builder().produit("Maïs grain").prix(BigDecimal.valueOf(250)).localite("Ouahigouya").source("INERA").build(),
                CoursSemence.builder().produit("Igname").prix(BigDecimal.valueOf(500)).localite("Ouahigouya").source("SONAGESS").build(),
                CoursSemence.builder().produit("Manioc").prix(BigDecimal.valueOf(200)).localite("Koudougou").source("SONAGESS").build(),
                CoursSemence.builder().produit("Tomate").prix(BigDecimal.valueOf(800)).localite("Ouagadougou").source("Marché central").build(),
                CoursSemence.builder().produit("Oignon").prix(BigDecimal.valueOf(650)).localite("Bobo-Dioulasso").source("INERA").build(),
                CoursSemence.builder().produit("Piment frais").prix(BigDecimal.valueOf(1200)).localite("Ouagadougou").source("Marché central").build(),
                CoursSemence.builder().produit("Aubergine").prix(BigDecimal.valueOf(400)).localite("Banfora").source("INERA").build(),
                CoursSemence.builder().produit("Gingembre").prix(BigDecimal.valueOf(1500)).localite("Ouahigouya").source("Marché central").build(),
                CoursSemence.builder().produit("Anacarde").prix(BigDecimal.valueOf(650)).localite("Ouahigouya").source("SONAGESS").build()
        ));

        // ============================================================
        // 4. Produits — chaque produit possède son image dédiée
        // ============================================================
        Produit pBanane = produitRepository.save(Produit.builder()
                .titre("Banane plantain mûre").description("Banane plantain bien mûre, idéale pour l'alloco. Régimes récoltés du jour.")
                .prix(BigDecimal.valueOf(1500)).uniteVente("régime").quantiteDisponible(60)
                .photos(List.of("assets/product-banana.jpg"))
                .categorie(fruits).localite("Bobo-Dioulasso").vendeur(producteur).estActif(true)
                .dateRecolte(LocalDate.now().minusDays(1)).build());

        Produit pTomate = produitRepository.save(Produit.builder()
                .titre("Tomates fraîches").description("Tomates rouges cultivées en plein champ, récoltées le matin même. Calibre moyen homogène.")
                .prix(BigDecimal.valueOf(1000)).uniteVente("kg").quantiteDisponible(120)
                .photos(List.of("assets/product-tomate.jpg"))
                .categorie(legumes).localite("Ouagadougou").vendeur(producteur).estActif(true)
                .dateRecolte(LocalDate.now()).build());

        Produit pIgname = produitRepository.save(Produit.builder()
                .titre("Igname de Tenkodogo").description("Igname fraîchement déterrée, variété locale à chair ferme. Vente par tas.")
                .prix(BigDecimal.valueOf(2500)).uniteVente("tas").quantiteDisponible(40)
                .photos(List.of("assets/product-igname.jpg"))
                .categorie(cereales).localite("Bobo-Dioulasso").vendeur(producteur).estActif(true).build());

        Produit pPoulet = produitRepository.save(Produit.builder()
                .titre("Poulets fermiers").description("Poulets élevés en plein air et nourris au maïs local. Poids moyen 1,8 kg.")
                .prix(BigDecimal.valueOf(3500)).uniteVente("unité").quantiteDisponible(30)
                .photos(List.of("assets/product-poulet.jpg"))
                .categorie(elevage).localite("Bobo-Dioulasso").vendeur(producteur).estActif(true).build());

        Produit pOeuf = produitRepository.save(Produit.builder()
                .titre("Œufs frais de plein air").description("Œufs frais à coquille brune, riches en oméga-3. Plateau de 30 unités.")
                .prix(BigDecimal.valueOf(250)).uniteVente("unité").quantiteDisponible(300)
                .photos(List.of("assets/product-oeuf.jpg"))
                .categorie(elevage).localite("Bobo-Dioulasso").vendeur(producteur).estActif(true).build());

        Produit pOrange = produitRepository.save(Produit.builder()
                .titre("Oranges juteuses").description("Oranges de saison, bien sucrées et juteuses, parfaites pour les jus frais.")
                .prix(BigDecimal.valueOf(800)).uniteVente("kg").quantiteDisponible(150)
                .photos(List.of("assets/product-orange.jpg"))
                .categorie(fruits).localite("Banfora").vendeur(producteur).estActif(true)
                .dateRecolte(LocalDate.now().minusDays(2)).build());

        Produit pAvocat = produitRepository.save(Produit.builder()
                .titre("Avocats fondants").description("Avocats à maturité contrôlée, chair onctueuse. Idéals pour la consommation directe.")
                .prix(BigDecimal.valueOf(1200)).uniteVente("kg").quantiteDisponible(80)
                .photos(List.of("assets/product-avocat.jpg"))
                .categorie(fruits).localite("Banfora").vendeur(producteur).estActif(true).build());

        Produit pCajou = produitRepository.save(Produit.builder()
                .titre("Noix de cajou brutes").description("Noix de cajou fraîchement récoltées et séchées au soleil, calibre export.")
                .prix(BigDecimal.valueOf(3000)).uniteVente("kg").quantiteDisponible(100)
                .photos(List.of("assets/product-cajou.jpg"))
                .categorie(fruits).localite("Ouahigouya").vendeur(agentRelais).estActif(true).build());

        Produit pAubergine = produitRepository.save(Produit.builder()
                .titre("Aubergines violettes").description("Aubergines violettes à calibre moyen, récolte du jour. Chair tendre et peu de graines.")
                .prix(BigDecimal.valueOf(600)).uniteVente("kg").quantiteDisponible(70)
                .photos(List.of("assets/product-aubergine.jpg"))
                .categorie(legumes).localite("Banfora").vendeur(producteur).estActif(true).build());

        Produit pManioc = produitRepository.save(Produit.builder()
                .titre("Manioc frais").description("Manioc frais de qualité, idéal pour l'attiéké et le placali. Sac de 25 kg.")
                .prix(BigDecimal.valueOf(1500)).uniteVente("sac 25kg").quantiteDisponible(25)
                .photos(List.of("assets/product-manioc.jpg"))
                .categorie(cereales).localite("Koudougou").vendeur(producteur2).estActif(true).build());

        Produit pMais = produitRepository.save(Produit.builder()
                .titre("Maïs grain jaune").description("Maïs grain jaune séché, propre et trié. Idéal pour la consommation et l'alimentation animale.")
                .prix(BigDecimal.valueOf(1200)).uniteVente("sac 50kg").quantiteDisponible(60)
                .photos(List.of("assets/product-mais.jpg"))
                .categorie(cereales).localite("Ouahigouya").vendeur(agentRelais).estActif(true).build());

        Produit pRiz = produitRepository.save(Produit.builder()
                .titre("Riz local parfumé").description("Riz local décortiqué, grain long et parfumé, cultivé dans la vallée du Kou.")
                .prix(BigDecimal.valueOf(1800)).uniteVente("sac 25kg").quantiteDisponible(45)
                .photos(List.of("assets/product-riz.jpg"))
                .categorie(cereales).localite("Bobo-Dioulasso").vendeur(producteur).estActif(true).build());

        Produit pHuile = produitRepository.save(Produit.builder()
                .titre("Huile de palme rouge artisanale").description("Huile de palme traditionnelle extraite à la main, sans conservateurs ni additifs.")
                .prix(BigDecimal.valueOf(2000)).uniteVente("litre").quantiteDisponible(50)
                .photos(List.of("assets/product-huile.jpg"))
                .categorie(transformes).localite("Koudougou").vendeur(producteur2).estActif(true).build());

        Produit pAttieke = produitRepository.save(Produit.builder()
                .titre("Attiéké frais").description("Attiéké de qualité supérieure, semoule de manioc fermentée, prêt à consommer.")
                .prix(BigDecimal.valueOf(500)).uniteVente("sac 1kg").quantiteDisponible(80)
                .photos(List.of("assets/product-attieke.jpg"))
                .categorie(transformes).localite("Ouagadougou").vendeur(producteur2).estActif(true).build());

        Produit pJus = produitRepository.save(Produit.builder()
                .titre("Jus de bissap artisanal").description("Jus de bissap pur, sans colorants ni conservateurs. Bouteille de 75 cl.")
                .prix(BigDecimal.valueOf(1000)).uniteVente("bouteille").quantiteDisponible(40)
                .photos(List.of("assets/product-jus.jpg"))
                .categorie(transformes).localite("Koudougou").vendeur(producteur2).estActif(true).build());

        Produit pBle = produitRepository.save(Produit.builder()
                .titre("Farine de blé locale").description("Farine de blé tendre moulue localement, idéale pour la pâtisserie et le pain.")
                .prix(BigDecimal.valueOf(2200)).uniteVente("sac 25kg").quantiteDisponible(35)
                .photos(List.of("assets/product-ble.jpg"))
                .categorie(transformes).localite("Koudougou").vendeur(producteur2).estActif(true).build());

        Produit pPiment = produitRepository.save(Produit.builder()
                .titre("Piment frais local").description("Piment frais très parfumé, idéal pour les sauces et le kédjénou. Sachet de 500 g.")
                .prix(BigDecimal.valueOf(500)).uniteVente("sachet").quantiteDisponible(200)
                .photos(List.of("assets/product-piment.jpg"))
                .categorie(epices).localite("Bobo-Dioulasso").vendeur(producteur).estActif(true).build());

        Produit pGingembre = produitRepository.save(Produit.builder()
                .titre("Gingembre frais").description("Gingembre frais et piquant, récolté dans la région de Ouahigouya. Vendu au kilo.")
                .prix(BigDecimal.valueOf(1500)).uniteVente("kg").quantiteDisponible(50)
                .photos(List.of("assets/product-gingembre.jpg"))
                .categorie(epices).localite("Ouahigouya").vendeur(agentRelais).estActif(true).build());

        Produit pMiel = produitRepository.save(Produit.builder()
                .titre("Miel naturel de forêt").description("Miel 100 % naturel récolté en forêt, non pasteurisé. Pot de 500 g.")
                .prix(BigDecimal.valueOf(4500)).uniteVente("pot 500g").quantiteDisponible(30)
                .photos(List.of("assets/product-miel.jpg"))
                .categorie(miel).localite("Bobo-Dioulasso").vendeur(producteur).estActif(true).build());

        Produit pSemences = produitRepository.save(Produit.builder()
                .titre("Semences de maïs certifiées").description("Semences de maïs hybride sélectionnées par l'INERA, haut rendement et résistantes à la sécheresse.")
                .prix(BigDecimal.valueOf(1800)).uniteVente("kg").quantiteDisponible(90)
                .photos(List.of("assets/product-mais.jpg"))
                .categorie(semences).localite("Ouahigouya").vendeur(agentRelais).estActif(true).build());

        // ============================================================
        // 5. Contenus d'apprentissage
        // ============================================================
        contenuApprentissageRepository.saveAll(List.of(
                ContenuApprentissage.builder()
                        .titre("Techniques de culture du maïs en zone tropicale")
                        .typeContenu("ARTICLE")
                        .contenu("Le maïs est une culture essentielle. Pour un rendement optimal, préparez le sol deux semaines avant les premières pluies, espacez les semis de 80 cm entre les lignes et 40 cm sur la ligne, et apportez un engrais NPK au 15e jour après semis. Les variétés locales offrent une meilleure résistance à la sécheresse.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Calendrier des semis pour les cultures maraîchères")
                        .typeContenu("GUIDE")
                        .contenu("Tomate : semis en pépinière de septembre à novembre, repiquage à 30 jours. Aubergine : semis de février à avril, récolte à 90 jours. Piment : semis possible toute l'année en zone forestière, récolte à 75 jours. Arrosez matin et soir en saison sèche et paillez le sol pour conserver l'humidité.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Lutte biologique contre les ravageurs")
                        .typeContenu("VIDEO")
                        .contenu("La lutte biologique réduit l'usage des pesticides chimiques. Solutions naturelles : extraits de neem, introduction d'auxiliaires, champignons entomopathogènes. Le suivi régulier des parcelles permet une détection précoce des attaques.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Transformation artisanale du manioc en attiéké")
                        .typeContenu("ARTICLE")
                        .contenu("Étapes : épluchage et lavage des tubercules, râpage, fermentation 24 h avec le sel, pressage pour extraire l'eau, séchage ou toastage, puis cuisson à la vapeur 20 minutes. Un attiéké de qualité se conserve trois jours au frais.")
                        .estValide(true).validePar(admin).build(),
                ContenuApprentissage.builder()
                        .titre("Élevage de poules pondeuses en milieu rural")
                        .typeContenu("GUIDE")
                        .contenu("Matériel : poulailler, abreuvoirs et pondoirs. Alimentation : maïs concassé (60 %), son de riz (20 %), compléments protéiques (20 %). Une poule pond en moyenne 250 œufs par an. Prévoyez la vaccination contre la maladie de Newcastle et un nettoyage hebdomadaire.")
                        .estValide(true).validePar(admin).build()
        ));

        // ============================================================
        // 6. Annonces matériel — photo correcte pour chaque équipement
        // ============================================================
        annonceMaterielRepository.saveAll(List.of(
                AnnonceMateriel.builder()
                        .titre("Motoculteur Honda F220").description("Motoculteur Honda F220, puissance 7 CV, 3 vitesses avant + 1 arrière. Garantie 2 ans.")
                        .prix(BigDecimal.valueOf(850000)).etat(EtatMateriel.NEUF).typeTransaction(TypeTransaction.VENTE)
                        .photos(List.of("/uploads/materiel-motoculteur.jpg"))
                        .localite("Bobo-Dioulasso").vendeur(producteur).build(),
                AnnonceMateriel.builder()
                        .titre("Pulvérisateur à dos 16 L").description("Pulvérisateur manuel de 16 litres, bon état, utilisé une seule saison.")
                        .prix(BigDecimal.valueOf(15000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.VENTE)
                        .photos(List.of("/uploads/materiel-pulverisateur.jpg"))
                        .localite("Koudougou").vendeur(producteur2).build(),
                AnnonceMateriel.builder()
                        .titre("Location tracteur Mahindra 475 DI")
                        .description("Tracteur Mahindra 475 DI, 1000 h, entretien à jour. Location à la journée ou à la semaine.")
                        .prix(BigDecimal.valueOf(25000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.LOCATION)
                        .duree("Journée / Semaine").caution(BigDecimal.valueOf(100000)).disponibilites("Lundi-Samedi 7h-18h")
                        .photos(List.of("/uploads/materiel-tracteur.jpg"))
                        .localite("Ouahigouya").vendeur(agentRelais).build(),
                AnnonceMateriel.builder()
                        .titre("Brouette renforcée 100 L").description("Brouette professionnelle, capacité 100 litres, pneu plein. Idéale pour les chantiers agricoles.")
                        .prix(BigDecimal.valueOf(45000)).etat(EtatMateriel.NEUF).typeTransaction(TypeTransaction.VENTE)
                        .photos(List.of("/uploads/materiel-brouette.jpg"))
                        .localite("Ouagadougou").vendeur(producteur2).build(),
                AnnonceMateriel.builder()
                        .titre("Filets d'ombrage pour pépinière").description("Lot de 5 filets d'ombrage 70 %, dimensions 4 x 6 m. Très bon état.")
                        .prix(BigDecimal.valueOf(35000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.VENTE)
                        .photos(List.of("/uploads/materiel-filets.jpg"))
                        .localite("Banfora").vendeur(producteur).build(),
                AnnonceMateriel.builder()
                        .titre("Moulins à maïs électriques").description("Lot de 2 moulins à maïs électriques, puissance 5 CV chacun. Fonctionnent au groupe électrogène.")
                        .prix(BigDecimal.valueOf(250000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.VENTE)
                        .photos(List.of("/uploads/materiel-moulin.jpg"))
                        .localite("Bobo-Dioulasso").vendeur(producteur2).build(),
                AnnonceMateriel.builder()
                        .titre("Location décortiqueuse à riz")
                        .description("Décortiqueuse à riz motorisée, capacité 500 kg/h. Location à la journée avec opérateur.")
                        .prix(BigDecimal.valueOf(35000)).etat(EtatMateriel.OCCASION).typeTransaction(TypeTransaction.LOCATION)
                        .duree("Journée (8h)").caution(BigDecimal.valueOf(50000)).disponibilites("Tous les jours sur rendez-vous")
                        .photos(List.of("/uploads/materiel-decortiqueuse.jpg"))
                        .localite("Bobo-Dioulasso").vendeur(producteur).build()
        ));

        // ============================================================
        // 7. Articles du forum
        // ============================================================
        articleForumRepository.saveAll(List.of(
                ArticleForum.builder().titre("Le prix du maïs grimpe en cette période")
                        .contenu("Je constate une hausse du prix du maïs sur les marchés ces dernières semaines. D'autres producteurs observent-ils la même tendance dans leur région ? Quelles sont vos stratégies de stockage ?")
                        .categorie("Marché").auteur(producteur).estModere(false).build(),
                ArticleForum.builder().titre("Conseils pour débuter en agriculture biologique")
                        .contenu("Je souhaite me lancer dans l'agriculture biologique sur deux hectares près d'Ouagadougou. Quelles sont les premières étapes ? Faut-il une certification ? Merci pour vos retours d'expérience.")
                        .categorie("Conseils").auteur(acheteur).estModere(true).build(),
                ArticleForum.builder().titre("Quelle variété d'igname pour le foutou ?")
                        .contenu("Entre l'igname kponan, bètè et florido, laquelle donne la meilleure texture pour le foutou ? Je cherche une chair à la fois ferme et élastique.")
                        .categorie("Cultures").auteur(producteur2).estModere(false).build(),
                ArticleForum.builder().titre("Vente groupée de tomates : qui est partant ?")
                        .contenu("Nous sommes cinq producteurs de la région de Bobo-Dioulasso et souhaitons mutualiser la vente de nos tomates pour négocier de meilleurs prix auprès des acheteurs de Ouagadougou. Manifestez-vous si cela vous intéresse.")
                        .categorie("Entraide").auteur(producteur).estModere(true).build(),
                ArticleForum.builder().titre("Feuilles jaunissantes sur mes plants de piment")
                        .contenu("Depuis une semaine, les feuilles de mes plants de piment jaunissent et certaines tombent. J'ai essayé le purin d'ortie sans résultat. Quelqu'un a-t-il déjà rencontré ce problème ?")
                        .categorie("Maladies").auteur(agentRelais).estModere(false).build(),
                ArticleForum.builder().titre("Limiter les pertes lors du transport de légumes")
                        .contenu("Je perds beaucoup de produits frais pendant le transport vers Ouagadougou. Comment conservez-vous la fraîcheur de vos légumes ? Véhicules réfrigérés ou autres méthodes ?")
                        .categorie("Logistique").auteur(producteur2).estModere(true).build(),
                ArticleForum.builder().titre("Comment obtenir un crédit agricole ?")
                        .contenu("Je souhaite investir dans un système d'irrigation goutte-à-goutte pour ma plantation de tomates. Quelles banques ou institutions de microfinance proposent des crédits adaptés aux petits producteurs ?")
                        .categorie("Financement").auteur(producteur).estModere(false).build(),
                ArticleForum.builder().titre("Recette : confiture de mangue maison")
                        .contenu("En pleine saison des mangues, voici ma recette : 1 kg de mangues mûres, 500 g de sucre et le jus d'un citron. Cuire 45 minutes à feu doux en remuant. Se conserve six mois au frais et valorise les invendus.")
                        .categorie("Recettes").auteur(acheteur).estModere(true).build()
        ));

        // ============================================================
        // 8. Conversations & messages
        // ============================================================
        Conversation conv1 = conversationRepository.save(Conversation.builder()
                .participants(Set.of(producteur, acheteur)).build());
        messageRepository.saveAll(List.of(
                Message.builder().conversation(conv1).expediteur(acheteur)
                        .contenu("Bonjour Mamadou, je suis intéressée par vos bananes plantain. Sont-elles encore disponibles ?").build(),
                Message.builder().conversation(conv1).expediteur(producteur)
                        .contenu("Bonjour Fatou, oui, il m'en reste une soixantaine de régimes. Combien vous en faut-il ?").build(),
                Message.builder().conversation(conv1).expediteur(acheteur)
                        .contenu("Je voudrais cinq régimes pour commencer. Livrez-vous à Ouagadougou ?").build(),
                Message.builder().conversation(conv1).expediteur(producteur)
                        .contenu("Oui, je peux livrer au marché central. On se retrouve samedi matin si cela vous convient ?").build()
        ));

        Conversation conv2 = conversationRepository.save(Conversation.builder()
                .participants(Set.of(producteur2, logisticien)).build());
        messageRepository.saveAll(List.of(
                Message.builder().conversation(conv2).expediteur(producteur2)
                        .contenu("Bonjour Seydou, j'ai besoin de faire livrer 50 sacs de manioc de Koudougou à Ouagadougou. Pouvez-vous me faire un devis ?").build(),
                Message.builder().conversation(conv2).expediteur(logisticien)
                        .contenu("Bonjour Youssouf, bien sûr. Pour 50 sacs de 25 kg, comptez environ 75 000 FCFA et deux jours de transport. Je programme cela ?").build()
        ));

        // ============================================================
        // 9. Évaluations
        // ============================================================
        evaluationRepository.saveAll(List.of(
                Evaluation.builder().note(5).donneur(acheteur).receveur(producteur)
                        .commentaire("Produits de très bonne qualité et livraison rapide. Je recommande.").build(),
                Evaluation.builder().note(4).donneur(acheteur).receveur(producteur)
                        .commentaire("Bon rapport qualité-prix, les bananes étaient bien mûres.").build(),
                Evaluation.builder().note(5).donneur(producteur).receveur(acheteur)
                        .commentaire("Paiement rapide et ponctuel, bonne communication.").build(),
                Evaluation.builder().note(4).donneur(acheteur).receveur(producteur2)
                        .commentaire("Produit conforme, livraison légèrement tardive.").build()
        ));

        // ============================================================
        // 10. Commandes, lignes et paiements
        // ============================================================
        Commande cmd1 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.LIVREE)
                .montantTotal(BigDecimal.valueOf(7500))
                .fraisLivraison(BigDecimal.valueOf(2000))
                .adresseLivraison("Marché central, Ouagadougou")
                .acheteur(acheteur).producteur(producteur).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd1).produit(pBanane).quantite(5).prixUnitaire(BigDecimal.valueOf(1500)).build());
        paiementRepository.save(Paiement.builder()
                .commande(cmd1).montant(BigDecimal.valueOf(7500))
                .methode("Mobile Money").reference("ORANGE-20250601-001")
                .statut("PAYÉ").build());

        Commande cmd2 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.EN_PREPARATION)
                .montantTotal(BigDecimal.valueOf(14000))
                .fraisLivraison(BigDecimal.valueOf(5000))
                .adresseLivraison("Ouaga 2000, Ouagadougou")
                .notes("Livrer entre 14 h et 16 h").acheteur(acheteur).producteur(producteur2).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd2).produit(pManioc).quantite(4).prixUnitaire(BigDecimal.valueOf(1500)).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd2).produit(pAttieke).quantite(16).prixUnitaire(BigDecimal.valueOf(500)).build());
        paiementRepository.save(Paiement.builder()
                .commande(cmd2).montant(BigDecimal.valueOf(14000))
                .methode("Orange Money").reference("OM-20260620-002")
                .statut("PAYÉ").build());

        Commande cmd3 = commandeRepository.save(Commande.builder()
                .statut(StatutCommande.EN_ATTENTE)
                .montantTotal(BigDecimal.valueOf(11500))
                .fraisLivraison(BigDecimal.valueOf(3000))
                .adresseLivraison("Bobo-Dioulasso, secteur 7")
                .acheteur(producteur2).producteur(producteur).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd3).produit(pPoulet).quantite(2).prixUnitaire(BigDecimal.valueOf(3500)).build());
        ligneCommandeRepository.save(LigneCommande.builder()
                .commande(cmd3).produit(pMiel).quantite(1).prixUnitaire(BigDecimal.valueOf(4500)).build());

        // ============================================================
        // 11. Produits vedettes
        // ============================================================
        produitVedetteRepository.saveAll(List.of(
                ProduitVedette.builder().produit(pBanane)
                        .dateDebut(LocalDateTime.now().minusDays(2))
                        .dateFin(LocalDateTime.now().plusDays(12)).estActive(true).build(),
                ProduitVedette.builder().produit(pMiel)
                        .dateDebut(LocalDateTime.now().minusDays(5))
                        .dateFin(LocalDateTime.now().plusDays(9)).estActive(true).build(),
                ProduitVedette.builder().produit(pTomate)
                        .dateDebut(LocalDateTime.now())
                        .dateFin(LocalDateTime.now().plusDays(14)).estActive(true).build()
        ));

        // ============================================================
        // 12. Demandes de livraison & suivi
        // ============================================================
        DemandeLivraison dl1 = demandeLivraisonRepository.save(DemandeLivraison.builder()
                .commande(cmd1).adresseDepart("Bobo-Dioulasso, zone industrielle")
                .adresseArrivee("Ouagadougou").distanceKm(350f)
                .frais(BigDecimal.valueOf(2000)).statut("LIVRÉ")
                .partenaire(logisticien).build());
        suiviLivraisonRepository.saveAll(List.of(
                SuiviLivraison.builder().demandeLivraison(dl1).statut("PRISE_EN_CHARGE").localisation("Bobo-Dioulasso").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("EN_TRANSIT").localisation("Boromo").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("ARRIVÉE").localisation("Ouagadougou").build(),
                SuiviLivraison.builder().demandeLivraison(dl1).statut("LIVRÉ").localisation("Ouagadougou").build()
        ));

        DemandeLivraison dl2 = demandeLivraisonRepository.save(DemandeLivraison.builder()
                .commande(cmd2).adresseDepart("Koudougou, zone agricole")
                .adresseArrivee("Ouaga 2000, Ouagadougou").distanceKm(280f)
                .frais(BigDecimal.valueOf(5000)).statut("EN_TRANSIT")
                .partenaire(logisticien).build());
        suiviLivraisonRepository.saveAll(List.of(
                SuiviLivraison.builder().demandeLivraison(dl2).statut("PRISE_EN_CHARGE").localisation("Koudougou").build(),
                SuiviLivraison.builder().demandeLivraison(dl2).statut("EN_TRANSIT").localisation("Banfora").build()
        ));

        // ============================================================
        // 13. Paramètres plateforme
        // ============================================================
        parametreRepository.saveAll(List.of(
                Parametre.builder().cle("commission_rate").valeur("5").type("BIGDECIMAL")
                        .description("Taux de commission plateforme en pourcentage").build(),
                Parametre.builder().cle("yengapay_enabled").valeur("false").type("BOOLEAN")
                        .description("Activer l'intégration YengaPay").build(),
                Parametre.builder().cle("yengapay_api_key").valeur("").type("STRING")
                        .description("Clé API YengaPay").build(),
                Parametre.builder().cle("yengapay_merchant_id").valeur("").type("STRING")
                        .description("Identifiant marchand YengaPay").build(),
                Parametre.builder().cle("yengapay_sandbox_mode").valeur("true").type("BOOLEAN")
                        .description("Mode sandbox YengaPay").build()
        ));

        System.out.println("--- SmartAgriMarket : catalogue réaliste initialisé ---");
        System.out.printf("Catégories        : %d%n", categories.size());
        System.out.printf("Utilisateurs      : %d%n", utilisateurRepository.count());
        System.out.printf("Cours semences    : %d%n", coursSemenceRepository.count());
        System.out.printf("Produits          : %d%n", produitRepository.count());
        System.out.printf("Apprentissages    : %d%n", contenuApprentissageRepository.count());
        System.out.printf("Annonces matériel : %d%n", annonceMaterielRepository.count());
        System.out.printf("Articles forum    : %d%n", articleForumRepository.count());
        System.out.printf("Conversations     : %d%n", conversationRepository.count());
        System.out.printf("Évaluations       : %d%n", evaluationRepository.count());
        System.out.printf("Commandes         : %d%n", commandeRepository.count());
        System.out.printf("Produits vedettes : %d%n", produitVedetteRepository.count());
        System.out.printf("Demandes livraison: %d%n", demandeLivraisonRepository.count());
        System.out.println("-------------------------------------------------------");
    }
}
