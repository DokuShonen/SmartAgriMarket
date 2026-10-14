# SmartAgriMarket - Ngrok

## Liens actuels

| Service  | URL |
|----------|-----|
| Frontend | https://b9db-102-180-208-245.ngrok-free.app |
| Backend  | https://58dd-102-180-208-245.ngrok-free.app |

## Demarrage

```bash
# Depuis la racine du projet (config dans docs/ngrok.yml)
ngrok start --config docs/ngrok.yml backend frontend
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
ngrok start --config docs/ngrok.yml backend frontend
```

## Notes

- Les URL changent a chaque redemarrage de ngrok
- Mettre a jour NGROK.md apres chaque redemarrage
