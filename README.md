# `matrix-tesseract-bot`

A bot to run an OCR with tesseract on image sent to it.

"tesseract-ocr" package must be installed, though it is included in the Dockerfile.

- Replace `config/example.yaml` by `config/default.yaml`
- Change configuration in config/default.yaml.
- Change the Matrix server and add the "access-token" of the bot user of your server.

### Installation :

- run `npm install`

- `npm run build`

- then `npm run start:dev`

And it should work

Invite the bot in a non encrypted room, then send the message `!tesseract help` to access to commands list.

### Docker :

Run `docker build -t <user>/<image-name> .`

Then `docker run -d --name <container-name> <user>/<image-name>`
