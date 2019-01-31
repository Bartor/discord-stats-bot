const db = require('mysql2');
const config = JSON.parse(require('fs').readFileSync('config/db.json'));

const connection = db.createConnection({
    host: config.host,
    port: config.port,
    user: config.webuser,
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
    getAllChannels: function (guildId, cb) {
        connection.query('SELECT C.name AS channelName, C.id AS channelId, G.name AS guildName, C.type AS type FROM Channels C JOIN Guilds G ON C.guildId = G.id WHERE guildId = ?', [guildId], cb);
    },
    getAllGuilds: function (cb) {
        connection.query('SELECT * FROM Guilds', cb);
    },
    getMessFromWeek: function (guildId, cb) {
        connection.query('SELECT M.time AS time FROM Messages M JOIN Channels C ON M.channel = C.id JOIN Guilds G ON C.guildID = G.id WHERE time > DATE_SUB(NOW(), INTERVAL 1 week) AND guildId = ?', [guildId], cb);
    },
    getMessFromDay: function (guildId, day, cb) {
        connection.query('SELECT U.id AS id, time, userName, G.name AS guildName FROM Messages M JOIN Channels C ON M.channel = C.id JOIN Guilds G ON C.guildId = G.id JOIN Users U ON M.author = U.id WHERE G.id = ? AND DAY(M.time) = DAY(?)', [guildId, day], cb);
    },
    getMessFromChannel: function (channelId, cb) {
        connection.query('SELECT time, userName, G.name AS guildName, C.name AS channelName, G.id AS guildId, U.id AS id FROM Messages M JOIN Channels C ON M.channel = C.id JOIN Guilds G ON C.guildId = G.ID JOIN Users U ON M.author = U.id WHERE C.id = ?', [channelId], cb);
    },
    getChannelLogs: function (channelId, cb) {
        connection.query('SELECT * FROM MessageLog WHERE channel = ?', channelId, cb);
    },
    getChannelGuildInfo: function (channelId, cb) {
        connection.query('SELECT C.name AS channelName, G.id AS guildId, G.name AS guildName FROM Channels C JOIN Guilds G ON C.guildId = G.id WHERE C.id = ?', [channelId], cb);
    },
    getSchema: function (cb) {
        connection.query('SELECT table_name, column_name FROM `INFORMATION_SCHEMA`.`columns` WHERE table_schema = "discordstats" AND table_name not like "v%"', [], cb);
    },
    getUserOnGuilds: function(id, cb) {
        connection.query('SELECT * FROM Users U JOIN GuildUser GU ON U.id = GU.user JOIN Guilds G ON G.id = GU.guildId WHERE U.id = ?', [id], cb);
    },
    getAllUsers: function(cb) {
        connection.query('SELECT U.id, U.username, count(guildId) as count FROM GuildUser GU JOIN USERS U ON U.id = GU.user group by GU.user', [], cb);
    },
    customQuery: function(query, cb) {
        connection.query(query, [], cb);
    }
}