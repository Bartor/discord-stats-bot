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
    getAllGuildUsers: function(guildId, cb) {
        connection.query('SELECT * FROM GuildUser GU JOIN U ON GU.user = U.id WHERE guildId = ?', [guildId], cb);
    },
    getAllGuilds: function(cb) {
        connection.query('SELECT * FROM Guilds', cb);
    },
    getAllDelsCount: function(channelId, cb) {
        connection.query('SELECT COUNT(*) AS Count FROM MessageLog WHERE channel = ? AND Event = "MessageDeleted"', [channelId], cb);
    },
    getAllEditsCount: function(channelId, cb) {
        connection.query('SELECT COUNT(*) AS Count FROM MessageLog WHERE channel = ? AND Event = "MessageEdited"', [channelId], cb);
    },
    getAllMessCount: function(channelId, cb) {
        connection.query('SELECT COUNT(*) AS Count FROM Messages WHERE channel = ?', [channelId], cb);
    },
    getMessFromWeek: function(guildId, cb) {
        connection.query('SELECT M.time AS time FROM Messages M JOIN Channels C ON M.channel = C.id JOIN Guilds G ON C.guildID = G.id WHERE time > DATE_SUB(NOW(), INTERVAL 1 week) AND guildId = ?', [guildId], cb);
    }
}