const connector = require('../connectors/commandConnector');
const decorator = require('../util/decorator');
const parser = require('../util/parser');

module.exports = {
    run: function(msg) {
        let words = msg.content.toLowerCase().split(' ');

        let channels = null, authors = null, from = new Date(0), to = new Date();

        for (let i = 0; i < words.length; i++) {
            if (words[i] === 'channels') {
                channels = words[i+1].split(',');
                i++;
            } else if (words[i] === 'authors') {
                authors = words[i+1].split(',');
                i++;
            } else if (words[i] === 'from') {
                from = new Date(words[i+1]);
                i++;
            } else if (words[i] === 'to') {
                to = new Date(words[i+1]);
                i++;
            }
        }

        try {
            if (channels) channels = channels.map(e => parser.parseChannel(e, msg.guild).id);
            if (authors) authors = authors.map(e => parser.parseUser(e, msg.guild).id);
        } catch(e) {
            console.log(e);
            msg.reply('That\'t not a valid user/channel');
            return;
        }

        connector.getMessageCount(msg.guild.id, channels, authors, from, to, (err, rows, fields) => {
            if (err) {
                msg.reply('Error occured, check console');
                console.log(err);
            } else {
                msg.reply(decorator(fields, rows));
            }
        });
    }
}