package com.smartagrimarket.service;

import com.smartagrimarket.dto.ProduitRequest;
import com.smartagrimarket.dto.ProduitResponse;
import com.smartagrimarket.entity.Categorie;
import com.smartagrimarket.entity.Produit;
import com.smartagrimarket.entity.Utilisateur;
import com.smartagrimarket.repository.CategorieRepository;
import com.smartagrimarket.repository.ProduitRepository;
import com.smartagrimarket.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ProduitResponse create(UUID vendeurId, ProduitRequest request) {
        Utilisateur vendeur = utilisateurRepository.findById(vendeurId)
                .orElseThrow(() -> new RuntimeException("Vendeur introuvable"));
        Categorie categorie = categorieRepository.findById(request.getCategorieId())
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));

        Produit produit = Produit.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .prix(request.getPrix())
                .uniteVente(request.getUniteVente())
                .quantiteDisponible(request.getQuantiteDisponible())
                .categorie(categorie)
                .localite(request.getLocalite())
                .photos(request.getPhotos())
                .conditionsLivraison(request.getConditionsLivraison())
                .dateRecolte(request.getDateRecolte())
                .ficheTechnique(request.getFicheTechnique())
                .vendeur(vendeur)
                .build();

        return ProduitResponse.from(produitRepository.save(produit));
    }

    @Transactional(readOnly = true)
    public Page<ProduitResponse> search(String keyword, UUID categorieId, String localite,
                                         BigDecimal prixMin, BigDecimal prixMax, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produitRepository.search(keyword, categorieId, localite, prixMin, prixMax, pageable)
                .map(ProduitResponse::from);
    }

    @Transactional(readOnly = true)
    public List<ProduitResponse> getAll() {
        return produitRepository.findAll().stream()
                .map(ProduitResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProduitResponse getById(UUID id) {
        return produitRepository.findById(id)
                .map(ProduitResponse::from)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
    }

    @Transactional(readOnly = true)
    public List<ProduitResponse> getByVendeur(UUID vendeurId) {
        return produitRepository.findByVendeurId(vendeurId).stream()
                .map(ProduitResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProduitResponse> getByVendeurActifs(UUID vendeurId) {
        return produitRepository.findByVendeurIdAndEstActifTrue(vendeurId).stream()
                .map(ProduitResponse::from)
                .toList();
    }

    public ProduitResponse update(UUID id, ProduitRequest request) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        Categorie categorie = categorieRepository.findById(request.getCategorieId())
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));

        produit.setTitre(request.getTitre());
        produit.setDescription(request.getDescription());
        produit.setPrix(request.getPrix());
        produit.setUniteVente(request.getUniteVente());
        produit.setQuantiteDisponible(request.getQuantiteDisponible());
        produit.setCategorie(categorie);
        produit.setLocalite(request.getLocalite());
        produit.setPhotos(request.getPhotos());
        produit.setConditionsLivraison(request.getConditionsLivraison());

        return ProduitResponse.from(produitRepository.save(produit));
    }

    public void delete(UUID id) {
        produitRepository.deleteById(id);
    }

    @Transactional
    public ProduitResponse toggleActif(UUID id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        produit.setEstActif(!produit.isEstActif());
        return ProduitResponse.from(produitRepository.save(produit));
    }

    @Transactional(readOnly = true)
    public Page<ProduitResponse> searchAll(String keyword, UUID categorieId, String localite,
                                            BigDecimal prixMin, BigDecimal prixMax, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produitRepository.searchAll(keyword, categorieId, localite, prixMin, prixMax, pageable)
                .map(ProduitResponse::from);
    }
}
