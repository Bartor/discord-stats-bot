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

        try {
            if (choice === 'channel') {
                id = parser.parseChannel(id, msg.guild).id;
            } else if (choice === 'user') {
                id = parser.parseUser(id, msg.guild).id;
            }
        } catch(e) {
            msg.reply('Unrecognized author/channel.');
            return;
        }

        switch(choice) {
            case 'guild': {
                connector.getGuildHistory(msg.guild.id, (err, rows, fields) => {
                    if (err) {
                        msg.reply('Error occured, check console.');
                        console.log(err);
                    } else {
                        msg.reply(decorator(fields, rows.map(e => {
                            switch(e.event) {
                                case 'GuildCreated': {
                                    e.event = 'created';
                                    break;
                                }
                                case 'GuildDeleted': {
                                    e.event = 'deleted';
                                    break;
                                }
                                case 'GuildNameChanged': {
                                    e.event = 'renamed';
                                    break;
                                }
                            }
                            return e;
                        })), {split: {
                            prepend: "```html\n",
                            append: '```'
                        }});
                    }
                });
                break;
            }
            case 'user': {
                connector.getUserHistory(msg.guild.id, id, (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        msg.reply('Error occured, check console.');
                    } else {
                        msg.reply(decorator(fields, rows.map(e => {
                            switch (e.event) {
                                case 'GuildUserNameChanged': {
                                    e.event = 'chaned nick';
                                    break;
                                }
                                case 'GuildUserCreated': {
                                    e.event = 'joined';
                                    break;
                                }
                                case 'GuildUserDeleted': {
                                    e.event = 'left';
                                    break;
                                }
                            }
                            return e;
                        })), {split: {
                            prepend: '```html\n',
                            append: '```'
                        }});
                    };
                })
                break;
            }
            case 'channel': {
                connector.getChannelHistory(msg.guild.id, id, (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        msg.reply('Error occured, check console.');
                    } else {
                        msg.reply(decorator(fields, rows.map(e => {
                            switch (e.event) {
                                case 'ChannelCreated': {
                                    e.event = 'created';
                                    break;
                                }
                                case 'ChannelNameChanged': {
                                    e.event = 'renamed';
                                    break;
                                }
                                case 'ChannelDeleted': {
                                    e.event = 'deleted';
                                    break;
                                }
                            }
                            return e;
                        })), {split: {
                            prepend: '```html\n',
                            append: '```'
                        }});
                    }
                });
                break;
            }
        }
    }
}