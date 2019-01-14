const fs = require('fs');

const commands = new Map();

for (let dir of fs.readdirSync('commands/')) {
    commands.set(dir, require(__dirname + '/commands/' + dir));
    console.log(dir + ' loaded');
}

module.exports = {
    interpret: function(msg) {
        for (let [key, value] of commands) {
            if (key.startsWith(msg.content.split(' ')[0])) {
                value.run(msg);
            }
        }
    }
};