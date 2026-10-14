    ```plantuml
@startuml
actor "Acheteur" as Acheteur
actor "Producteur" as Producteur
participant Systeme
        participant "Filtre Anti-Contournement" as Filtre

Acheteur -> Systeme : 1. Envoyer message
Systeme -> Filtre : Analyser contenu

alt Contenu suspect
  Filtre --> Systeme : Contenu masque
  Systeme -> Acheteur : Message envoye (contenu filtre)
    Systeme -> Producteur : Message filtre affiche
else Contenu valide
    Filtre --> Systeme : Contenu OK
  Systeme -> Producteur : Message original
end

  note right of Acheteur : Suspension apres 3 violations
@enduml
```
