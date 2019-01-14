const fs = require('fs');
const discord = require('discord.js');

const discordConfig = JSON.parse(fs.readFileSync('config/discord.json'));

const bot = new discord.Client();

bot.login(discordConfig.token).then(reply => {
    console.log('Connection established');
}).catch(err => {
    console.log(err);
    process.exit();
});

bot.on('ready', () => {
    console.log('Bot ready, registring event handlers');

    require('./handlers/channel').register(bot);
    require('./handlers/guild').register(bot);
    require('./handlers/message').register(bot);
    require('./handlers/user').register(bot);

    console.log('Handlers registered, working now');
    console.log('Syncing data...');

    require('./util/syncAll')(bot);

    console.log('Synced');
});