const connector = require('../connectors/commandConnector');
const decorator = require('../util/decorator');

module.exports = {
    run: function(msg) {
        let words = msg.content.split(' ');
        switch (words.length) {
            case 1: {
                connector.getMessageCount(msg.guild.id, null, null, new Date(0), new Date(), (err, rows, fields) => {
                    if (err) {
                        msg.reply('Error occured, check console');
                        console.log(err);
                    } else {
                        msg.reply(decorator(fields, rows));
                    }
                });
            }
        }
    }
}