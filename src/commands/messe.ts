import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import config from "../config";

export async function runMesseCommand(roomId: string, args: string[], client: MatrixClient) {
    
    let arg = args[1];
    var request = require('request');
    
    var todayDate = new Date().toISOString().slice(0,10);
    var url = 'https://api.aelf.org/v1/messes/'+ todayDate + '/' + config.country ;
    let text = "Lectures de la Messe\n";
    let html = "<h3>Lectures de la Messe</h3>\n";

    let displayLecture = function(lecture) {
        let thislecture = {
            type: lecture.type,
            intro: lecture.intro_lue,
            titre: lecture.titre,
            ref: lecture.ref,
            contenu: lecture.contenu
        }
        
        let lecture_type = "";
        let lecture_type__display = "";
        switch ( lecture.type ) {
            case "lecture_1":
                lecture_type__display = "Première lecture";
                lecture_type = "lecture";
                break;
            case "evangile":
                lecture_type__display = "Évangile";
                lecture_type = "evangile";
                break;
            case "psaume":
                lecture_type__display = "Psaume";
                lecture_type = "psaume";
                break;
            default:
                lecture_type__display = "";
                lecture_type = "";
                break;
        }
        
        if ( args[0] === lecture_type || args[0] === "messe" ) {
            
            let reference = lecture.ref.replace(",", " "); //enlève la virgule de la référence.
            let references = reference.split(" "); //parse la référence pour obtenir le lien.
            let lien = "";
            if ( lecture_type === "psaume" ) {
                lien = 'https://www.aelf.org/bible/Ps/' + references[0];
            } else {
                lien = 'https://www.aelf.org/bible/' + references[0] + '/' + references[1];
            }
            
            html += '<h4>'+ lecture_type__display +'</h4>' + 
                '<h5>' + `${lecture.titre || ''}` + ' (<a href="'+ lien + '">' + `${lecture.ref}` + '</a>)</h5>';
            text += lecture_type__display +'\n' + `${lecture.titre || ''}` + ' (' + `${lecture.ref}` + ')\n';
            
            if (args[0] != "messe" || args[1] === "tout") {
                html += `${lecture.contenu}`;
                text += `${lecture.contenu}`;
            }
        }

        
        
    }
    
    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
        console.log('Error:', err);
        } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        } else {
            
            let lectures = data.messes[0].lectures;
            lectures.forEach(displayLecture);
                   
            return client.sendMessage(roomId, {
                body: text,
                msgtype: "m.notice",
                format: "org.matrix.custom.html",
                formatted_body: html,
            });
            
        
            
        }
    });
    
}
