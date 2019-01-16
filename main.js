const fs = require('fs');
const discord = require('discord.js');
const express = require('express');
const path = require('path');

const interpreter = require('./messageInterpreter');

const indexRouter = require('./web/routers/index');

const discordConfig = JSON.parse(fs.readFileSync('config/discord.json'));

const bot = new discord.Client();

bot.login(discordConfig.token).then(reply => {
    console.log('Connection established');
}).catch(err => {
    console.log(err);
    process.exit();
});

let app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/web/views'));

app.use(express.static(path.join(__dirname, '/web/static')));

app.use('/', indexRouter);

let httpServer = require('http').createServer(app);
httpServer.listen(2137, () => {
    console.log('Listening on 2137');
});

bot.on('ready', () => {
    console.log('Bot ready, registring event handlers');

    require('./handlers/channel').register(bot);
    require('./handlers/guild').register(bot);
    require('./handlers/message').register(bot);
    require('./handlers/user').register(bot);

    console.log('Handlers registered, working now');
    console.log('Syncing data...');

    require('./util/syncAll')(bot, (r) => {
        r ? console.log('Synced') : console.log('Sync error!');
    });
});