const connector = require('../connectors/commandConnector');
const decorator = require('../util/decorator');
const parser = require('../util/parser');

module.exports = {
    help: {
        desc: "Recalls recorded history of an entity.",
        params: [
            {
                name: "'guild'|'channel'|'user'",
                desc: "chooses whose history to show",
                req: true
            },
            {
                name: "chan1|user1",
                desc: "if channel or user was chosen as a first param, you have to provide it",
                req: false
            }
        ]
    },
    run: function(msg) {
        let words = msg.content.toLowerCase().split(' ');

        let choice = words[1];
        let id = words[2];
    
        if (choice !== 'guild' && !(choice&&id)) {
            msg.reply('Bad usage.');
            return;
        }

        try {
            if (choice === 'channel') {
                id = parser.parseChannel(id).id;
            } else if (choice === 'user') {
                id = parser.parseUser(id).id;
            } else {
                msg.reply('Bad usage.');
                return;
            }
        } catch(e) {
            msg.reply('Unrecognized author/channel.');
            return;
        }

        
    }
}