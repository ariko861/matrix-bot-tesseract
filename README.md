# `matrix-aelf-bot`

Un bot pour renvoyer les caractères reconnus par tesseract-ocr des images envoyées.

- Remplacer `config/example.yaml` par `config/default.yaml`
- Changer la configuration dans config/default.yaml.
- Changer le serveur Matrix et ajouter votre "access-token" en le faisant correspondre à l'utilisateur Matrix que vous souhaitez utiliser en tant que bot.

### Installation :

- lancer `npm install`

- `npm run build`

- Puis `npm run start:dev`

Le bot devrait fonctionner.

Inviter le bot à un salon non chiffré, puis envoyer le message `!tesseract help` pour accéder à la liste des commandes.

### Docker :

Lancer `docker build -t <user>/<nom-de-l'image> .`

La nouvelle image docker devrait être apparue dans `docker images`.

La lancer simplement avec `docker run -d --name <nom-du-container> <user>/<nom-de-l'image>`
