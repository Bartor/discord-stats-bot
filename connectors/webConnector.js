const db = require('mysql2');
const config = JSON.parse(require('fs').readFileSync('config/db.json'));

const connection = db.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: "DiscordStats"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        process.exit();
    } else {
        console.log('Connected to db');
    }
});

module.exports = {
    getAllChannels: function(guildId, cb) {
        connection.query('SELECT C.name AS channelName, C.id AS channelId, G.name AS guildName, C.type AS type FROM Channels C JOIN Guilds G ON C.guildId = G.id WHERE guildId = ?', [guildId], cb);
    },
    getAllGuilds: function(cb) {
        connection.query('SELECT * FROM Guilds', cb);
    },
    getMessFromWeek: function(guildId, cb) {
        connection.query('SELECT M.time AS time FROM Messages M JOIN Channels C ON M.channel = C.id JOIN Guilds G ON C.guildID = G.id WHERE time > DATE_SUB(NOW(), INTERVAL 1 week) AND guildId = ?', [guildId], cb);
    },
    getMessFromDay: function(guildId, day, cb) {
        connection.query('SELECT time, userName, G.name AS guildName FROM Messages M JOIN Channels C ON M.channel = C.id JOIN Guilds G ON C.guildId = G.id JOIN Users U ON M.author = U.id WHERE G.id = ? AND DAY(M.time) = DAY(?)', [guildId, day], cb);
    }   
}