# SmartAgriMarket - Ngrok

## Liens actuels

| Service  | URL |
|----------|-----|
| Frontend | https://a56b-102-179-158-119.ngrok-free.app |
| Backend  | https://1c9a-102-179-158-119.ngrok-free.app |

## Demarrage

```bash
# Depuis la racine du projet
ngrok start --config ngrok.yml backend frontend
```

Ou avec le script dev :

```bash
./dev.sh
```

## Depuis un autre poste

```bash
# Installer ngrok
curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz | sudo tar -xz -C /usr/local/bin

# Configurer le token (une seule fois)
ngrok config add-authtoken 2zOEBv4NXHPnJlgYErMezKZudFm_5csYFuw4L9Ay5QiwXWCff

# Demarrer
ngrok start --config ngrok.yml backend frontend
```

## Notes

- Les URL changent a chaque redemarrage de ngrok
- Mettre a jour NGROK.md apres chaque redemarrage
