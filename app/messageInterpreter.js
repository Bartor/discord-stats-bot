const fs = require('fs');

const commands = new Map();

for (let dir of fs.readdirSync('commands/')) {
    commands.set(dir, require(__dirname + '/commands/' + dir));
    console.log(dir + ' loaded');
}

function help(msg) {
    let words = msg.content.toLowerCase().split(' ');
    if (words.length === 1) {
        let replyString = '```md\n# Listing commands:\n'
        for (let [k, v] of commands) replyString += `> ${k.split('.')[0]} - ${v.help.desc}\n`;
        replyString += '```';
        msg.reply(replyString);
    } else {
        let cmd = words[1];
        for (let [k, v] of commands) {
            if (k.split('.')[0] === cmd) {
                cmd = v;
                break;
            }
        }
        if (typeof cmd === 'object') {
            let replyString = '```md\n# Help for command ' + words[1] + '\n';
            replyString += `Description: ${cmd.help.desc}\n`;
            replyString += `Parameters:\n`
            for (let p of cmd.help.params) {
                replyString += `> ${!p.req ? '[' : ''}${p.name}${!p.req ? ']' : ''} - ${p.desc}\n`
            }
            replyString += '```';
            msg.reply(replyString);
        } else {
            msg.reply('Couldn\'t find the command');
        }
    }
}

module.exports = {
    interpret: function(msg) {
        if (msg.content.toLowerCase().split(' ')[0] === 'help') {
            help(msg);
            return;
        }
        for (let [key, value] of commands) {
            if (key.split('.')[0] === msg.content.split(' ')[0]) {
                value.run(msg);
            }
        }
    }
};