const { exec } = require('child_process');
const fs = require('fs');

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
                exec(`mysqldump DiscordStats --host=${user.host} --port=${user.port} --user=${user.user} --password=${user.password} --result-file=dump${new Date().getTime()}.sql`, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                        msg.reply('Error occured, check conole; make sure that mysqldump is in the system variables');
                    } else {
                        msg.reply('Backup successful.');
                    }
                });
            }
        });
    }
}