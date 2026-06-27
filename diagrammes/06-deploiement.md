# Diagramme de Deploiement — Architecture Angular + Spring Boot

```plantuml
@startuml
node "Client" {
  [Navigateur Web]
  [Application Mobile (future)]
}

node "CDN" {
  [Fichiers statiques (Angular build)]
}

node "Serveur Frontend (Angular)" {
  [Application SPA Angular]
  [CoreModule]
  [SharedModule]
  [Feature Modules]
}

node "Serveur Backend (Spring Boot)" {
  [API Gateway / Spring Security]
  [AuthController]
  [ProduitController]
  [CommandeController]
  [MessagerieController]
  [CoursSemenceController]
  [ProduitVedetteController]
  [CategorieController]
}

node "Couche Service" {
  [AuthService]
  [ProduitService]
  [CommandeService]
  [MessagerieService]
}

node "Couche Persistance (JPA / Hibernate)" {
  [UtilisateurRepository]
  [ProduitRepository]
  [CommandeRepository]
  [ConversationRepository]
  [MessageRepository]
}

node "Base de donnees" {
  [PostgreSQL]
  [Redis (Cache)]
  [MinIO / S3 (Fichiers)]
}

node "Services Externes" {
  [YengaPay / Mobile Money]
  [API SMS]
}

[Navigateur Web] --> [CDN]
[Navigateur Web] --> [Serveur Frontend (Angular)]

[Serveur Frontend (Angular)] --> [Serveur Backend (Spring Boot)] : REST API (JSON)

[Serveur Backend (Spring Boot)] --> [Couche Service]
[Couche Service] --> [Couche Persistance (JPA / Hibernate)]

[Couche Persistance (JPA / Hibernate)] --> [PostgreSQL]
[Couche Persistance (JPA / Hibernate)] --> [Redis (Cache)]

[Serveur Backend (Spring Boot)] --> [YengaPay / Mobile Money]
[Serveur Backend (Spring Boot)] --> [API SMS]
[Serveur Backend (Spring Boot)] --> [MinIO / S3 (Fichiers)]

@enduml
```
