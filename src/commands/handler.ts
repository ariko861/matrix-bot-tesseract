import { LogService, MatrixClient, MessageEvent, RichReply, UserID } from "matrix-bot-sdk";
import { runHelloCommand } from "./hello";
import config from "../config";
import * as htmlEscape from "escape-html";
const fs = require('fs')
const request = require('request')
const tesseract = require("node-tesseract-ocr");

// The prefix required to trigger the bot. The bot will also respond
// to being pinged directly.
export const COMMAND_PREFIX = "!tesseract";

// This is where all of our commands will be handled
export default class CommandHandler {

    // Just some variables so we can cache the bot's display name and ID
    // for command matching later.
    private displayName: string;
    private userId: string;
    private localpart: string;

    constructor(private client: MatrixClient) {
    }

    public async start() {
        // Populate the variables above (async)
        await this.prepareProfile();

        // Set up the event handler
        this.client.on("room.message", this.onMessage.bind(this));
    }

    private async prepareProfile() {
        this.userId = await this.client.getUserId();
        this.localpart = new UserID(this.userId).localpart;

        try {
            const profile = await this.client.getUserProfile(this.userId);
            if (profile && profile['displayname']) this.displayName = profile['displayname'];
        } catch (e) {
            // Non-fatal error - we'll just log it and move on.
            LogService.warn("CommandHandler", e);
        }
    }

    private async onMessage(roomId: string, ev: any) {
        const event = new MessageEvent(ev);
        if (event.isRedacted) return; // Ignore redacted events that come through
        if (event.sender === this.userId) return; // Ignore ourselves
        if (event.messageType !== "m.text" && event.messageType !== "m.image") return; // Ignore non-text messages
        const userPermitted = config.permissions.invite;
        let senderServerAndName = event.sender.split(":");
        const userIsAllowed = ( userPermitted.includes(event.sender) || userPermitted.includes("*" + senderServerAndName[1]) || userPermitted.includes("*") );
        
        if (event.messageType === "m.image") { // Appel cette fonction si le message est une image
            if (!userIsAllowed) return;
            const tesseract_config = {
                lang: config.language,
                oem: 1,
                psm: 3,
            }
            let mxc = event['content']['url']
            let imageurl = mxc.replace('mxc://', config.homeserverUrl + '/_matrix/media/r0/download/');
            let path = config.dataPath + '/' + 'image_for_tesseract'+ roomId +'.jpg';
            const download = (url, path, callback) => {
                request.head(url, (err, res, body) => {
                    request(url)
                    .pipe(fs.createWriteStream(path))
                    .on('close', callback)
                })
            }
            
            download(imageurl, path, () => {
                tesseract.recognize(path, tesseract_config)
                .then(translatedtext => {
                    const text = `${translatedtext}`;
                    const html = `${htmlEscape(translatedtext)}`;
                    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
                    reply["msgtype"] = "m.notice"; // Bots should always use notices
                    return this.client.sendMessage(roomId, reply);
                })
                .catch(error => {
                    const text = `${error}` +'\n' + event.textBody;
                    const html = `${htmlEscape(error)}`+'\n' + event.textBody;
                    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
                    reply["msgtype"] = "m.notice"; // Bots should always use notices
                    return this.client.sendMessage(roomId, reply);
                })
            })
            
            
        } else {
            

            // Ensure that the event is a command before going on. We allow people to ping
            // the bot as well as using our COMMAND_PREFIX.
            const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
            const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
            if (!prefixUsed) return; // Not a command (as far as we're concerned)

            // Check to see what the arguments were to the command
            const args = event.textBody.substring(prefixUsed.length).trim().split(' ');

            // Try and figure out what command the user ran, defaulting to help
            try {
                if (!userIsAllowed) { // Send a message refusing authorization if user is not allowed
                    const notAuthorized = "Désolé, vous n'avez pas l'autorisation de consulter ce Bot";
                    
                    const text = `${notAuthorized}`;
                    const html = `${htmlEscape(notAuthorized)}`;
                    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
                    reply["msgtype"] = "m.notice"; // Bots should always use notices
                    return this.client.sendMessage(roomId, reply);
                }
                
                if (args[0] === "hello") {
                    return runHelloCommand(roomId, event, args, this.client);
                } else {
                    const help = "Envoyez une photo dans ce salon pour lancer la reconnaissance de caractères.";

                    const text = `${help}`;
                    const html = `${htmlEscape(help)}`;
                    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
                    reply["msgtype"] = "m.notice"; // Bots should always use notices
                    return this.client.sendMessage(roomId, reply);
                }
            } catch (e) {
                // Log the error
                LogService.error("CommandHandler", e);

                // Tell the user there was a problem
                const message = "There was an error processing your command";
                const reply = RichReply.createFor(roomId, ev, message, message); // We don't need to escape the HTML because we know it is safe
                reply["msgtype"] = "m.notice";
                return this.client.sendMessage(roomId, reply);
            }
        }
    }
}
