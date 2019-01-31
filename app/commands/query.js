const connector = require('../connectors/userConnector');
const decorator = require('../util/decorator');

module.exports = {
    help: {
        desc: "Let's a guild admin use a custom SQL query on a view consisting of all of its guilds information.",
        params: [
            {
                name: "$$",
                desc: "substitutes for the view name, for example SELECT * FROM $$; will print all data from the view (warning: do not actually use it like that, it'll spam your channel *a lot*.",
                req: false
            },
            {
                name: "column names",
                desc: "messageId, messageAuthor, messageTime, messageChannel, channelId, channelName, channelGuild, channelType, guildId, guildName, guildOwner, userId, userUserName, userUserTag, nickname",
                req: false
            }
        ]
    },
    run: function(msg) {
        if (msg.author.id !== msg.guild.owner.id) {
            msg.reply('This command can be only used by guild owner.');
            return;
        }

        let q = msg.content.replace('$$', 'v'+msg.guild.id).split(' ');
        q.shift();
        q = q.join(' ');
        
        connector.connectAndQueryMessages(msg, q, (err, rows, fields) => {
            if (err) {
                console.log(err);
                msg.reply('Error occured, check console.');
            } else {
                msg.reply(decorator(fields, rows), {split: {
                    prepend: "```html\n",
                    append: '```'
                }});
            }
        })
    }
}