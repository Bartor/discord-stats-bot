const mysqldump = require('mysqldump');
const fs = require('fs');

const decorator = require('../util/decorator');
const parser = require('../util/parser');

module.exports = {
    help: {
        desc: "Backs up the entire db on the server.",
        params: []
    },
    run: function(msg) {
        if (msg.author.id !== msg.guild.owner.id) {
            msg.reply('This command can be only used by guild owner.');
            return;
        }

        fs.readFile('config/db.json', (err, data) => {
            if (err) {
                console.log(err);
                msg.reply('Error occured, check console.');
            } else {
                let user = JSON.parse(data);
                mysqldump({
                    connection: {
                        host: user.host,
                        port: user.port,
                        user: user.user,
                        password: user.password,
                        database: "DiscordStats"
                    },
                    dumpToFile: `./dump${new Date().getTime()}`
                });
            }
        });
    }
}