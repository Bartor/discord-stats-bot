const connector = require('../connectors/commandConnector');
const decorator = require('../util/decorator');
const parser = require('../util/parser');

module.exports = {
    help: {
        desc: "Counts edits on the guild.",
        params: [
            {
                name: "channels chan1,chan2,...",
                desc: "filters results by channels given as a next parameter (no-space comma separated)",
                req: false
            },
            {
                name: "authors auth1,auth2,...",
                desc: "filters results by authors given as a next parameter (no-space comma separated)",
                req: false
            },
            {
                name: "from datestring",
                desc: "filters results by allowing only those after datetime ('YYYY-MM-DDTHH-MM-SSZ')",
                req: false
            },
            {
                name: "to datestring",
                desc: "filters results by allowing only those before datetime ('YYYY-MM-DDTHH-MM-SSZ')",
                req: false
            },
            {
                name: "by 'channel'|'author'",
                desc: "groups results by authors or channels, default is 'channel'",
                req: false
            }
        ]
    },
    run: function(msg) {
        let words = msg.content.toLowerCase().split(' ');

        let channels = null, authors = null, from = new Date(0), to = new Date(), group = null;

        for (let i = 1; i < words.length; i++) {
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
            } else if (words[i] === 'by') {
                group = words[i+1] === 'author' ? 'author' : 'channel';
                i++;
            } else {
                msg.reply('Malformed query');
                return;
            }
        }

        try {
            if (channels) channels = channels.map(e => parser.parseChannel(e, msg.guild).id);
            if (authors) authors = authors.map(e => parser.parseUser(e, msg.guild).id);
        } catch(e) {
            msg.reply('Unrecognized author/channel.');
            return;
        }

        connector.getEditsCount(msg.guild.id, channels, authors, from, to, group, (err, rows, fields) => {
            if (err) {
                msg.reply('Malformed query.');
                console.log(err);
            } else {
                msg.reply(decorator(fields, rows));
            }
        });
    }
}